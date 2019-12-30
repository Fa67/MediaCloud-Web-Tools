import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../common/AppButton';
import withIntlForm from '../../../../common/hocs/IntlForm';
import messages from '../../../../../resources/messages';
import RedditPreview from './RedditPreview';
import { notEmptyString } from '../../../../../lib/formValidators';

const formSelector = formValueSelector('platform');

const localMessages = {
  title: { id: 'platform.create.edit.title', defaultMessage: 'Step 1: Configure Your Reddit platform' },
  intro: { id: 'platform.create.edit.intro', defaultMessage: 'Step 1: intro' },
  about: { id: 'platform.create.edit.about',
    defaultMessage: 'This Platform is driven by an open web seed query.  Any stories that match the query you create will be included in the Platform.' },
  errorNoKeywords: { id: 'platform.error', defaultMessage: 'You need to specify a query.' },
};

class EditRedditContainer extends React.Component {
  constructor(props) {
    // Track this in local React state because we don't need it anywhere else.
    // We can't read out of the form state becase we need to know when they click "search",
    // but that is updated live as they type.
    super(props);
    this.state = { query: null };
  }

  updateQuery = () => {
    const { change, currentQuery, currentPlatformType, channel } = this.props;
    // TODO add in subreddits
    change('currentPlatformType', currentPlatformType);
    change('channel', channel); // redux-form change action
    this.setState({ query: currentQuery });
  }

  handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        this.updateKeywords();
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    const { topicId, /* handleMediaChange */ renderTextField, handleSubmit, finishStep, location } = this.props;
    const { formatMessage } = this.props.intl;
    let previewContent = null;
    let nextButtonDisabled = true;
    if ((this.state.query !== null) && (this.state.query !== undefined) && (this.state.query.length > 0)) {
      nextButtonDisabled = false;
      previewContent = (
        <div>
          <RedditPreview topicId={topicId} query={this.state.query} location={location} />
        </div>
      );
    }
    return (
      <Grid>
        <form className="platform-create-edit-keyword" name="platform" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <p>
                <FormattedMessage {...localMessages.about} />
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} xs={12}>
              <Field
                name="query"
                component={renderTextField}
                placeholder={messages.searchByKeywords}
                fullWidth
                onKeyDown={this.handleKeyDown}
              />
            </Col>
            <Col lg={2} xs={12}>
              <AppButton
                id="open-web-preview-button"
                label={formatMessage(messages.search)}
                style={{ marginTop: 33 }}
                onClick={this.updateQuery}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={8} xs={12}>
              <Field
                name="channel"
                placeholder={formatMessage(messages.searchByRedditChannel)}
                component={renderTextField}
                fullWidth
                onKeyDown={this.handleKeyDown}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="media-field-wrapper">
                {previewContent}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={8} xs={12}>
              <AppButton disabled={nextButtonDisabled} type="submit" label={formatMessage(messages.next)} primary />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

EditRedditContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  onNextStep: PropTypes.func.isRequired,
  // from state
  currentPlatformType: PropTypes.string,
  currentPlatformInfo: PropTypes.object,
  currentQuery: PropTypes.string,
  channel: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from compositional helper
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentQuery: formSelector(state, 'query'),
  channel: formSelector(state, 'channel'),
  currentPlatformType: state.topics.selected.platforms.selected.select.currentPlatformType,
  currentPlatformInfo: state.topics.selected.platforms.selected.platformDetails,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: (values) => {
    const customProps = {
      query: values.query,
    };
    ownProps.onNextStep(customProps);
  },
});

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.query)) {
    errors.query = true; // localMessages.errorNoKeywords;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'platform', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
  validate,
};

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        EditRedditContainer
      )
    )
  )
);
