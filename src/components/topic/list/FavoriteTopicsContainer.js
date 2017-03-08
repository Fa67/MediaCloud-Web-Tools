import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchFavoriteTopics } from '../../../actions/topicActions';
import TopicList from './TopicList';

const localMessages = {
  favTopicsTitle: { id: 'topics.favorite.title', defaultMessage: 'My Favorite Topics' },
  noFavorites: { id: 'topics.favorite.none', defaultMessage: 'You don\'t have any favorite Topics yet. Click the star icon next to one on the list below to add it to your list of starred Topics.' },
};

const FavoriteTopicsContainer = (props) => {
  const { topics, onSetFavorited } = props;
  let content = null;
  if (topics.length === 0) {
    content = (<Row><Col lg={12} md={12} sm={12}><i><FormattedMessage {...localMessages.noFavorites} /></i></Col></Row>);
  } else {
    content = <TopicList topics={topics} onSetFavorited={onSetFavorited} />;
  }
  return (
    <div className="favorite-topics">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2><FormattedMessage {...localMessages.favTopicsTitle} /></h2>
        </Col>
      </Row>
      {content}
    </div>
  );
};

FavoriteTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: React.PropTypes.func.isRequired,
  // from state
  topics: React.PropTypes.array.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.favorite.fetchStatus,
  topics: state.topics.favorite.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFavoriteTopics());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FavoriteTopicsContainer
      )
    )
  );
