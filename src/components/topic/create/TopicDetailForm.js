import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Field, reduxForm, propTypes, validate } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../common/IntlForm';
import { TOPIC_FORM_MODE_EDIT } from './TopicForm';
import { WarningNotice } from '../../common/Notice';

const localMessages = {
  name: { id: 'topic.form.detail.name', defaultMessage: 'Name' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a name.' },
  advancedSettings: { id: 'topic.form.detail.advancedSettings', defaultMessage: 'Advanced Settings' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a description.' },
  seedQuery: { id: 'topic.form.detail.seedQuery', defaultMessage: 'Seed Query' },
  seedQueryError: { id: 'topic.form.detail.seedQuery.error', defaultMessage: 'You must give us a seed query to start this topic from.' },
  queryEditWarning: { id: 'topic.form.detal.query.edit.warning', defaultMessage: '<b>Be careful!</b> If you plan to edit the query and make a new snapshot make sure you only increase the scope of the query.  If you reduce the scope there will be stories from previous snapshots included that don\'t match your new reduced query.' },
  startDate: { id: 'topic.form.detail.startDate', defaultMessage: 'Start Date' },
  endDate: { id: 'topic.form.detail.endDate', defaultMessage: 'End Date' },
  public: { id: 'topic.form.detail.public', defaultMessage: 'Public?' },
  monitored: { id: 'topic.form.detail.monitored', defaultMessage: 'Crimson Hexagon Id' },
  max_iterations: { id: 'topic.form.detail.max_iterations', defaultMessage: 'Max Iterations' },
  twitter_topics_id: { id: 'topic.form.detail.twitter_topic', defaultMessage: 'Twitter Id' },
  createTopic: { id: 'topic.form.detail.create', defaultMessage: 'Create' },
  dateError: { id: 'topic.form.detail.date.error', defaultMessage: 'Please provide a date in YYYY-MM-DD format.' },
};

const TopicDetailForm = (props) => {
  const { renderTextField, renderCheckbox, renderSelectField, mode } = props;
  const { formatMessage, formatDate } = props.intl;
  const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let queryWarning = null;
  if (mode === TOPIC_FORM_MODE_EDIT) {
    queryWarning = (
      <WarningNotice>
        <FormattedHTMLMessage {...localMessages.queryEditWarning} />
      </WarningNotice>
    );
  }
  return (
    <div>
      <Row>
        <Col lg={10}>
          <Field
            name="name"
            component={renderTextField}
            floatingLabelText={localMessages.name}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.description}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={5}>
          <Field
            name="start_date"
            component={renderTextField}
            type="inline"
            fullWidth
            floatingLabelText={formatMessage(localMessages.startDate)}
            label={formatMessage(localMessages.startDate)}
            hintText={formatDate(localMessages.startDate)}
          />
        </Col>
        <Col lg={5}>
          <Field
            name="end_date"
            component={renderTextField}
            type="inline"
            fullWidth
            floatingLabelText={formatMessage(localMessages.endDate)}
            label={formatMessage(localMessages.endDate)}
            hintText={formatDate(localMessages.endDate)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <Field
            name="is_public"
            component={renderCheckbox}
            fullWidth
            label={formatMessage(localMessages.public)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="solr_seed_query"
            component={renderTextField}
            multiLine
            rows={2}
            rowsMax={4}
            fullWidth
            floatingLabelText={localMessages.seedQuery}
          />
          {queryWarning}
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Card style={{ boxShadow: 'none' }} >
            <CardHeader
              style={{ fontWeight: 'bold' }}
              title={formatMessage(localMessages.advancedSettings)}
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              <Row>
                <Col lg={12}>
                  <Field
                    name="ch_monitor_id"
                    component={renderTextField}
                    fullWidth
                    floatingLabelText={formatMessage(localMessages.monitored)}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Field
                    name="twitter_topics_id"
                    component={renderTextField}
                    fullWidth
                    floatingLabelText={formatMessage(localMessages.twitter_topics_id)}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Field
                    name="max_iterations"
                    component={renderSelectField}
                    fullWidth
                    floatingLabelText={localMessages.max_iterations}
                  >
                    {iterations.map(t => <MenuItem key={t} value={t} primaryText={t} />)}
                  </Field>
                </Col>
              </Row>
            </CardText>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

TopicDetailForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  renderDatePickerInline: React.PropTypes.func.isRequired,
  // from form helper
  handleSubmit: React.PropTypes.func.isRequired,
  // from parent
  mode: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
};

export default
  composeIntlForm(
    reduxForm({ propTypes, validate })(
      TopicDetailForm
    )
  );
