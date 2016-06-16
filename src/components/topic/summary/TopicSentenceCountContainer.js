import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicSentenceCount from './TopicSentenceCount';
import { fetchTopicSentenceCounts } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';
import messages from '../../../resources/messages';
import DownloadButton from '../../util/DownloadButton';

const localMessages = {
  title: { id: 'topic.summary.sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class TopicSentenceCountContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const { topicId, fetchData } = this.props;
      fetchData(topicId, nextProps.filters.snapshotId, nextProps.filters.timespanId);
    }
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  refetchData = () => {
    const { topicId, filters, fetchData } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId);
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/sentences/count.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { fetchStatus, total, counts } = this.props;
    const { formatMessage } = this.props.intl;
    let content = fetchStatus;
    const styles = this.getStyles();
    let headerContent = null;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        headerContent = <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />;
        content = <TopicSentenceCount total={total} counts={counts} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={this.refetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            {headerContent}
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

TopicSentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  topicId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.sentenceCount.fetchStatus,
  total: state.topics.selected.summary.sentenceCount.total,
  counts: state.topics.selected.summary.sentenceCount.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, timespanId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchTopicSentenceCounts(topicId, snapshotId, timespanId));
    }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSentenceCountContainer));
