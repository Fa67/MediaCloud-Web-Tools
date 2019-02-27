import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import AppButton from '../../common/AppButton';
import { goToTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './preview/TopicCreatePreview';

const localMessages = {
  title: { id: 'topic.create.preview.title', defaultMessage: 'Step 2: Preview Your Topic' },
  about: { id: 'topic.create.preview.about',
    defaultMessage: '<b>Make sure your topic looks right before you create it</b>.  We start your topic by finding all the stories in our database that match your query. From there we follow all the links and download them. We check if they match your keywords, and if they do then we add them to your topic (this is called "spidering"). Check the result below and make sure your topic is finding you the stories you want before creating it.' },
  prev: { id: 'topic.create.preview.prev', defaultMessage: 'back to seed query' },
  next: { id: 'topic.create.preview.next', defaultMessage: 'Validate Some Stories' },
};

const TopicPreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formData, mode } = props;
  const { formatMessage } = props.intl;
  const content = <TopicCreatePreview formData={formData} />;

  return (
    <Grid>
      <h1>
        <FormattedHTMLMessage {...localMessages.title} />
      </h1>
      <p>
        <FormattedHTMLMessage {...localMessages.about} />
      </p>
      { content }
      <br />
      <Row>
        <Col lg={12} md={12} sm={12}>
          <AppButton variant="outlined" label={formatMessage(localMessages.prev)} onClick={() => handlePreviousStep(mode)} />
          &nbsp; &nbsp;
          <AppButton primary type="submit" label={formatMessage(localMessages.next)} onClick={() => handleNextStep(mode)} />
        </Col>
      </Row>
    </Grid>
  );
};

TopicPreviewContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  currentStepText: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.modify.preview.workflow.currentStep,
  formData: state.form.topicForm.values,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: (mode) => {
    dispatch(push(`/topics/${mode}/0`));
    dispatch(goToTopicStep(0));
  },
  handleNextStep: (mode) => {
    dispatch(push(`/topics/${mode}/2`));
    dispatch(goToTopicStep(2));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
  });
}

export default
injectIntl(
  withIntlForm(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      TopicPreviewContainer
    )
  )
);
