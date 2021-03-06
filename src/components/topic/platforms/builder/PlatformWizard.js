import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { FormattedMessage, injectIntl } from 'react-intl';
import BackLinkingControlBar from '../../BackLinkingControlBar';
import Platform1ConfigureContainer from './Platform1ConfigureContainer';
import Platform2ValidateContainer from './Platform2ValidateContainer';
import Platform3ConfirmContainer from './Platform3ConfirmContainer';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';

const localMessages = {
  backToPlatformManager: { id: 'backToPlatformManager', defaultMessage: 'back to Platform Builder' },
  // step0Name: { id: 'platform.create.step0Name', defaultMessage: 'Pick a Platform' },
  step0Name: { id: 'platform.create.step1Name', defaultMessage: 'Configure' },
  step1Name: { id: 'platform.create.step2Name', defaultMessage: 'Validate' },
  step2Name: { id: 'platform.create.step3Name', defaultMessage: 'Confirm' },
};

class PlatformWizard extends React.Component {
  componentDidMount() {
    const { startStep, goToStep } = this.props;
    goToStep(startStep || 0);
  }

  shouldComponentUpdate = (nextProps) => {
    const { currentStep } = this.props;
    return currentStep !== nextProps.currentStep;
  }

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { topicId, topicInfo, currentStep, location, initialValues, onDone } = this.props;
    const steps = [
      Platform1ConfigureContainer,
      Platform2ValidateContainer,
      Platform3ConfirmContainer,
    ];
    const initAndTopicInfoValues = { ...initialValues, ...topicInfo, query: topicInfo.solr_seed_query };
    const CurrentStepComponent = steps[currentStep];
    return (
      <div className="platform-builder-wizard">
        <BackLinkingControlBar message={localMessages.backToPlatformManager} linkTo={`/topics/${topicId}/platforms/manage`}>
          <Stepper activeStep={currentStep}>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step0Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step1Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step2Name} /></StepLabel>
            </Step>
          </Stepper>
        </BackLinkingControlBar>
        <CurrentStepComponent
          topicId={topicId}
          location={location}
          initialValues={initAndTopicInfoValues}
          onDone={onDone}
          currentStep={currentStep}
          currentPlatformType={initAndTopicInfoValues.currentPlatform}
        />
      </div>
    );
  }
}

PlatformWizard.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  startStep: PropTypes.number,
  location: PropTypes.object,
  onDone: PropTypes.func.isRequired,
  // from state
  currentStep: PropTypes.number.isRequired,
  currentPlatform: PropTypes.string,
  // from dispatch
  goToStep: PropTypes.func.isRequired,
  handleUnmount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentStep: state.topics.selected.platforms.create ? state.topics.selected.platforms.create.workflow.currentStep : 0,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreatePlatformStep(step));
  },
  handleUnmount: () => {
    dispatch(goToCreatePlatformStep(0)); // reset for next time
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    PlatformWizard
  )
);
