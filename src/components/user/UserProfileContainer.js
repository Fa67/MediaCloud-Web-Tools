import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import AppButton from '../common/AppButton';
import { resetApiKey, requestData } from '../../actions/userActions';
import { addNotice, updateFeedback } from '../../actions/appActions';
import { LEVEL_ERROR } from '../common/Notice';
import PageTitle from '../common/PageTitle';

const API_REQUESTS_UNLIMITED = 0;

const localMessages = {
  admin: { id: 'user.profile.admin', defaultMessage: '<p><b>You are an admin-level user. Don\'t break anything!</b></p>' },
  email: { id: 'user.profile.email', defaultMessage: '<b>Email:</b> {email}' },
  name: { id: 'user.profile.name', defaultMessage: '<b>Name:</b> {name}' },
  apiRequests: { id: 'user.profile.apiRequests', defaultMessage: '<b>API Weekly Requests:</b> {requested} / {allowed}' },
  apiRequestedItems: { id: 'user.profile.apiRequestedItems', defaultMessage: '<b>API Weekly Requested Items:</b> {requested} / {allowed}' },
  apiKey: { id: 'user.profile.apiKey', defaultMessage: '<b>API Key (don\'t share this!):</b> {key}' },
  resetKey: { id: 'user.profile.apiKey.reset', defaultMessage: 'Reset API Key' },
  resetKeyAbout: { id: 'user.profile.apiKey.resetKeyAbout', defaultMessage: 'If you accidently share your API key with other people, or publicly, you should reset it.' },
  resetWorked: { id: 'user.profile.apiKey.resetWorked', defaultMessage: 'We reset your API key successfully' },

  otherActions: { id: 'user.profile.otherActions', defaultMessage: 'Other Things to Do' },
  requestData: { id: 'user.profile.requestData', defaultMessage: 'Request Data' },
  requestDataAbout: { id: 'user.profile.requestDataAbout', defaultMessage: 'You have the right to request a dump of all the data we have associated with your account.' },
  requestDataWorked: { id: 'user.profile.requestDataWorked', defaultMessage: 'Your request to get all your data has been received. We will respond via email in the next few days.' },
};

const UserProfileContainer = (props) => {
  const { profile, handleResetApiKey, handleRequestData } = props;
  const { formatMessage } = props.intl;
  const adminContent = (profile.auth_roles.includes('admin')) ? <FormattedHTMLMessage {...localMessages.admin} /> : null;
  return (
    <div className="user-profile">
      <Grid>
        <PageTitle value={messages.userProfile} />
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...messages.userProfile} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {adminContent}
            <ul>
              <li><FormattedHTMLMessage {...localMessages.email} values={{ email: profile.email }} /></li>
              <li><FormattedHTMLMessage {...localMessages.name} values={{ name: profile.full_name }} /></li>
              <li>
                <FormattedHTMLMessage
                  {...localMessages.apiRequests}
                  values={{
                    requested: profile.weekly_requests_sum,
                    allowed: (profile.weekly_requests_limit === API_REQUESTS_UNLIMITED) ? formatMessage(messages.unlimited) : profile.weekly_requests_limit,
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  {...localMessages.apiRequestedItems}
                  values={{
                    requested: profile.weekly_requested_items_sum,
                    allowed: (profile.weekly_requested_items_limit === API_REQUESTS_UNLIMITED) ? formatMessage(messages.unlimited) : profile.weekly_requests_limit,
                  }}
                />
              </li>
              <li><FormattedHTMLMessage {...localMessages.apiKey} values={{ key: profile.api_key }} /></li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.otherActions} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <AppButton
              label={formatMessage(localMessages.resetKey)}
              onClick={handleResetApiKey}
            />
            <FormattedMessage {...localMessages.resetKeyAbout} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <AppButton
              label={formatMessage(localMessages.requestData)}
              onClick={handleRequestData}
            />
            <FormattedMessage {...localMessages.requestDataAbout} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

UserProfileContainer.propTypes = {
  // from state
  profile: PropTypes.object.isRequired,
  // from dispatch
  handleResetApiKey: PropTypes.func.isRequired,
  handleRequestData: PropTypes.func.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleResetApiKey: () => {
    dispatch(resetApiKey())
      .then((results) => {
        if (results.error) {
          dispatch(addNotice({ message: results.error, level: LEVEL_ERROR }));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.resetWorked) }));
        }
      });
  },
  handleRequestData: () => {
    dispatch(requestData())
      .then((results) => {
        if (results.error) {
          dispatch(addNotice({ message: results.error, level: LEVEL_ERROR }));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.requestDataWorked) }));
        }
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    UserProfileContainer
  )
);
