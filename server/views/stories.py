from flask import jsonify
import flask_login
from operator import itemgetter
from itertools import groupby
import requests
import logging

from server import app, cliff, mc, NYT_THEME_LABELLER_URL
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.util.request import api_error_handler
import server.util.csv as csv
from server.cache import cache

logger = logging.getLogger(__name__)


@app.route('/api/stories/<stories_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_info(stories_id):
    user_mc = user_mediacloud_client()
    story = user_mc.story(stories_id)
    return jsonify({'info': story})


@app.route('/api/stories/<stories_id>/entities', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_entities(stories_id):
    entities = entities_from_mc_or_cliff(user_mediacloud_key(), stories_id)
    return jsonify({'list': entities})


@app.route('/api/stories/<stories_id>/entities.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_entities_csv(stories_id):
    # in the download include all entity types
    entities = entities_from_mc_or_cliff(user_mediacloud_key(), stories_id)
    props = ['type', 'name', 'frequency']
    return csv.stream_response(entities, props, 'story-'+str(stories_id)+'-entities')


def entities_from_mc_or_cliff(user_mediacloud_key, stories_id):
    entities = []
    # get entities from MediaCloud, or from CLIFF if not in MC
    cliff_results = cached_story_raw_cliff_results(stories_id)[0]['cliff']
    if (cliff_results == u'"story is not annotated"') or (cliff_results == u"story does not exist"):
        story = mc.story(stories_id, text=True)
        cliff_results = cliff.parseText(story['story_text'])
    # clean up for reporting
    for org in cliff_results['results']['organizations']:
        entities.append({
            'type': 'ORGANIZATION',
            'name': org['name'],
            'frequency': org['count']
        })
    for person in cliff_results ['results']['people']:
        entities.append({
            'type': 'PERSON',
            'name': person['name'],
            'frequency': person['count']
        })
    # places don't have frequency set correctly, so we need to sum them
    place_names = [place['name'] for place in cliff_results ['results']['places']['mentions']]
    locations = [{
        'type': 'LOCATION',
        'name': key,
        'frequency': len(list(group))
    } for key, group in groupby(place_names)]
    entities += locations
    # sort smartly
    unique_entities = sorted(entities, key=itemgetter('frequency'), reverse=True)
    return unique_entities


@cache
def cached_story_raw_cliff_results(stories_id):
    user_mc = user_mediacloud_client()
    themes = user_mc.storyRawCliffResults([stories_id])
    return themes


@app.route('/api/stories/<stories_id>/nyt-themes', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_nyt_themes(stories_id):
    themes = nyt_themes_from_mc_or_labeller(stories_id)['descriptors600']
    return jsonify({'list': themes})


@app.route('/api/stories/<stories_id>/nyt-themes.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_nyt_themes_csv(stories_id):
    themes = nyt_themes_from_mc_or_labeller(stories_id)['descriptors600']
    props = ['label', 'score']
    return csv.stream_response(themes, props, 'story-'+str(stories_id)+'-nyt-themes')


def nyt_themes_from_mc_or_labeller(stories_id):
    results = cached_story_raw_theme_results(stories_id)
    if results['nytlabels'] == u'"story is not annotated"':
        story = mc.story(stories_id, text=True)
        results = predict_news_labels(story['story_text'])
    else:
        results = results['nytlabels']
    return results


@cache
def cached_story_raw_theme_results(stories_id):
    user_mc = user_mediacloud_client()
    themes = user_mc.storyRawNytThemeResults([stories_id])[0]
    return themes


def predict_news_labels(story_text):
    url = "{}/predict.json".format(NYT_THEME_LABELLER_URL)
    try:
        r = requests.post(url, json={'text': story_text})
        return r.json()
    except requests.exceptions.RequestException as e:
        l.exception(e)
    return []