import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import slugify from 'slugify';
import { Row, Col } from 'react-flexbox-grid/lib';
import ActionMenu from '../../../common/ActionMenu';
import { fetchStory, resetSelectedStory } from '../../../../actions/storyActions';
import withHelp from '../../../common/hocs/HelpfulContainer';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import DataCard from '../../../common/DataCard';
import StoryDetails from '../../../common/story/StoryDetails';
import messages from '../../../../resources/messages';
import { downloadSvg } from '../../../util/svg';
import { updateFeedback } from '../../../../actions/appActions';

const localMessages = {
  title: { id: 'word.inContext.title', defaultMessage: 'Details for: {title}' },
  helpTitle: { id: 'word.inContext.help.title', defaultMessage: 'About Word in Context' },
  helpText: { id: 'word.inContext.help.text',
    defaultMessage: '<p>It is helpful to look at how a word is used, in addition to the fact that it is used.  While a word cloud can tell you what words are used, this interactive visualization can help you explore the use of a word in context.</p>',
  },
  close: { id: 'drilldown.story.inContext.close', defaultMessage: 'Close' },
  readThisStory: { id: 'drilldown.story.readThisStory', defaultMessage: 'Read This Story' },
  addingToQueries: { id: 'explorer.topWords.addingToQueries', defaultMessage: 'Running your updated search now.' },
};

class SelectedStoryDrillDownContainer extends React.Component {
  state = {
    imageUri: null,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData, storyId } = this.props;
    if ((nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.storyId !== storyId) && nextProps.storyId) {
      fetchData(nextProps.storyId);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { storyId } = this.props;
    return (nextProps.storyId !== storyId);
  }
  getUniqueDomId = () => 'story-';
  handleDownloadSvg = () => {
    const { storyInfo } = this.props;
    // a little crazy, but it works (we have to just walk the DOM rendered by the library we are using)
    const domId = this.getUniqueDomId();
    const svgNode = document.getElementById(domId).children[0].children[0].children[0].children[0];
    const svgDownloadPrefix = `${slugify(storyInfo)}-`;
    downloadSvg(svgDownloadPrefix, svgNode);
  }
  render() {
    const { storyId, storyInfo, handleAddToAllQueries, handleClose, helpButton } = this.props;
    const { formatMessage } = this.props.intl;

    let content = null;
    if (storyId) {
      content = (
        <div className="drill-down">
          <DataCard className="query-story-drill-down">
            <ActionMenu>
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.close)}
                onTouchTap={handleClose}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.readThisStory)}
                onTouchTap={() => handleAddToAllQueries(storyInfo)}
              />
            </ActionMenu>
            <h2>
              <FormattedMessage {...localMessages.title} values={{ title: storyInfo.title }} />
              {helpButton}
            </h2>
            <p>Published in <a href="source-manager-media-url">{storyInfo.sourceName}</a> on {storyInfo.pubDate}. Written in {storyInfo.storyLanguage}</p>
            <Row>
              <Col lg={12}>
                <StoryDetails story={storyInfo} />
              </Col>
            </Row>
            <h2>Published in {storyInfo.sourceName}</h2>
          </DataCard>
        </div>
      );
    }
    return content;
  }
}

SelectedStoryDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from store
  fetchStatus: PropTypes.string.isRequired,
  storyInfo: PropTypes.object,
  storyId: PropTypes.number,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleAddToAllQueries: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
    // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.explorer.stories.fetchStatus,
  storyInfo: state.story.info,
  storyId: state.story.info.stories_id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (params) => {
    dispatch(fetchStory(params));
  },
  handleAddToAllQueries: (word) => {
    ownProps.onQueryModificationRequested(word);
    dispatch(updateFeedback({ open: true,
      message: ownProps.intl.formatMessage(localMessages.addingToQueries, { word }) }));
  },
  handleClose: () => {
    dispatch(resetSelectedStory());
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.selectedStory);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordTreeHelpText])(
        withAsyncFetch(
          SelectedStoryDrillDownContainer
        )
      )
    )
  );

