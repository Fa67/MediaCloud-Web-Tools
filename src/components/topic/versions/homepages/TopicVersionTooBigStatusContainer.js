import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import AppButton from '../../../common/AppButton';
import Permissioned from '../../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../../lib/auth';
import messages from '../../../../resources/messages';
import TopicVersionStatus from './TopicVersionStatus';

const localMessages = {
  title: { id: 'version.error.title', defaultMessage: '<span class="error-background">Too Big</span>' },
  explanationTitle: { id: 'version.error.explanation.title', defaultMessage: 'What\'s the Problem?' },
  explanationText: { id: 'version.error.explanation.text', defaultMessage: 'Due to limitations in our infrastructure, you are limited to created topics that have a total of {maxTopicStories} stories (after spidering).  Your topic started with {seedStoryCount} stories in its seed query (see the box to the right).  Spidering added so many that it has now surpassed the {maxTopicStories} story maximum, reaching {totalCount} stories so far.  Unfortunatley we don’t have enough computational resources to support users creating topics that big, so we\'ve stopped your topic from generating completely.' },
  whatNowTitle: { id: 'version.error.explanation2.title', defaultMessage: 'What Should I Do Now?' },
  whatNowText: { id: 'version.error.explanation2.text', defaultMessage: 'You need to create a new version with fewer seed stories. You can do this in a few ways:<ul><li>make your query more specific</li><li>focus on a shorter timespan</li><li>start with fewer media sources and collections</li></ul>.' },
};

// BRITTLE: parses out the number of stories from the error msg saying the topic had too many stories
const storyCountFromJobMessage = jobMessage => /topic has ([^ ]*) stories/.exec(jobMessage)[1];

const TopicVersionTooBigStatusContainer = ({ topic, goToCreateNewVersion, snapshot, job, intl }) => (
  <React.Fragment>
    <TopicVersionStatus
      subtitle={localMessages.title}
      topic={topic}
      snapshot={snapshot}
      job={job}
    >
      <h2><FormattedMessage {...localMessages.explanationTitle} /></h2>
      <p>
        <FormattedMessage
          {...localMessages.explanationText}
          values={{
            maxTopicStories: intl.formatNumber(topic.max_stories),
            seedStoryCount: intl.formatNumber(topic.seed_query_story_count),
            totalCount: intl.formatNumber(storyCountFromJobMessage(job.message)),
          }}
        />
      </p>

      <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
        <h2><FormattedMessage {...localMessages.whatNowTitle} /></h2>
        <p><FormattedHTMLMessage {...localMessages.whatNowText} /></p>
        <div className="topic-stuck-created-or-error">
          <AppButton
            label={intl.formatMessage(messages.createNewVersion)}
            onClick={() => goToCreateNewVersion(topic.topics_id)}
            type="submit"
            primary
          />
        </div>
      </Permissioned>
    </TopicVersionStatus>
  </React.Fragment>
);

TopicVersionTooBigStatusContainer.propTypes = {
  // from state
  topic: PropTypes.object,
  filters: PropTypes.object,
  snapshot: PropTypes.object,
  job: PropTypes.object,
  goToCreateNewVersion: PropTypes.func,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionTooBigStatusContainer
);