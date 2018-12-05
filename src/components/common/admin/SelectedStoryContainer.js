import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { CloseButton } from '../IconButton';
import { fetchStory } from '../../../actions/storyActions';
import DataCard from '../DataCard';
import StoryEntitiesContainer from '../story/StoryEntitiesContainer';
import StoryNytThemesContainer from '../story/StoryNytThemesContainer';
import messages from '../../../resources/messages';
import withAsyncFetch from '../hocs/AsyncContainer';
import { urlToTools } from '../../../lib/urlUtil';
import { TAG_SET_NYT_THEMES } from '../../../lib/tagUtil';
import { trimToMaxLength } from '../../../lib/stringUtil';
import { storyPubDateToTimestamp } from '../../../lib/dateUtil';
import StatBar from '../statbar/StatBar';

const localMessages = {
  title: { id: 'admin.story.title', defaultMessage: 'Story Info: ' },
  close: { id: 'admin.story.inContext.close', defaultMessage: 'Close' },
  readThisStory: { id: 'admin.story.readThisStory', defaultMessage: 'Read This Story' },
  fullDescription: { id: 'admin.story.fullDescription', defaultMessage: 'Published in {media} on {publishDate} in {language}' },
  published: { id: 'admin.story.published', defaultMessage: 'Published in {media}' },
};

class SelectedStoryContainer extends React.Component {
  render() {
    const { selectedStory, handleClose } = this.props;
    const { formatDate } = this.props.intl;

    let content = null;
    if (selectedStory) {
      content = (
        <div ref={this.rootRef}>
          <DataCard className="admin-story-view">
            <Row>
              <Col lg={12}>
                <div className="actions">
                  <CloseButton onClick={handleClose} />
                </div>
                <h2>
                  <FormattedMessage {...localMessages.title} />
                  <a href={selectedStory.url} target="_blank" rel="noopener noreferrer">{trimToMaxLength(selectedStory.title, 80)}</a>
                </h2>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <StatBar
                  columnWidth={2}
                  stats={[
                    { message: messages.sourceName,
                      data: (
                        <a href={urlToTools(selectedStory.id)} target="_blank" rel="noopener noreferrer">
                          {selectedStory.media_name || selectedStory.media.name}
                        </a>
                      ),
                    },
                    { message: messages.storyDate,
                      data: formatDate(storyPubDateToTimestamp(selectedStory.publish_date)),
                    },
                    { message: messages.language,
                      data: selectedStory.language ? selectedStory.language : '?',
                    },
                    { message: messages.mediaType,
                      data: selectedStory.media.metadata.media_type ? selectedStory.media.metadata.media_type.label : '?',
                      helpTitleMsg: messages.mediaTypeHelpTitle,
                      helpContentMsg: messages.mediaTypeHelpContent,
                    },
                    { message: messages.pubCountry,
                      data: selectedStory.media.metadata.pub_country ? selectedStory.media.metadata.pub_country.label : '?',
                    },
                    { message: messages.pubState,
                      data: selectedStory.media.metadata.pub_state ? selectedStory.media.metadata.pub_state.label : '?' },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={9}>
                <StoryEntitiesContainer storyId={selectedStory.stories_id} />
              </Col>
              <Col lg={3}>
                <StoryNytThemesContainer
                  storyId={selectedStory}
                  tags={selectedStory.story_tags ? selectedStory.story_tags.filter(t => t.tag_sets_id === TAG_SET_NYT_THEMES) : []}
                  hideFullListOption
                />
              </Col>
            </Row>
          </DataCard>
        </div>
      );
    }
    return content;
  }
}

SelectedStoryContainer.propTypes = {
  // from parent
  asyncFetch: PropTypes.func.isRequired,
  // from store
  fetchStatus: PropTypes.string.isRequired,
  selectedStory: PropTypes.object.isRequired,
  // from dispatch
  handleClose: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.story.info.fetchStatus,
  selectedStory: state.story.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleClose: () => {
    // dispatch(resetStory());
  },
  asyncFetch: () => {
    if (ownProps.params && ownProps.params.id !== undefined) {
      dispatch(fetchStory(ownProps.params.id));
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      SelectedStoryContainer
    )
  )
);
