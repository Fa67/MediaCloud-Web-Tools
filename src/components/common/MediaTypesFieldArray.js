import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import { injectIntl } from 'react-intl';
import withIntlForm from './hocs/IntlForm';
import withAsyncData from './hocs/AsyncDataContainer';
import { fetchMetadataValuesForMediaType } from '../../actions/systemActions';
import { TAG_SET_MEDIA_TYPE } from '../../lib/tagUtil';
import messages from '../../resources/messages';

const localMessages = {
  label: { id: 'system.mediaPicker.sources.label', defaultMessage: '{label}' },
};

const MediaTypesSelector = ({ initialValues, renderCheckbox, onChange, intl: { formatMessage }, fields }) => (
  <ul>
    {fields.map((name, index, thisFieldArray) => { // redux-form overrides map, and converts name to a string instead of an object!
      const fieldObject = thisFieldArray.get(index);
      return (
        <li key={index}>
          <Field
            initialValues={initialValues}
            key={index}
            name={`${name}.label`}
            component={info => (
              <div>
                {renderCheckbox({ ...info, label: formatMessage(localMessages.label, { label: fieldObject.label }), input: { ...info.input, ...fieldObject, value: fieldObject.selected, onChange } })}
              </div>
            )}
            label={`${name}.label`}
            placeholder={formatMessage(messages.ok)}
          />
        </li>
      );
    })}
  </ul>
);

MediaTypesSelector.propTypes = {
  fields: PropTypes.object,
  initialValues: PropTypes.object,
  renderCheckbox: PropTypes.func.isRequired,
  intl: PropTypes.object,
  onChange: PropTypes.func,
};

const MediaTypesList = injectIntl(withIntlForm(MediaTypesSelector));

const MediaTypesFieldArray = (props) => {
  if (props.previouslySelected && props.previouslySelected.mediaType) {
    props.previouslySelected.mediaType.forEach((p) => {
      const toUpdate = props.initialValues.mediaType.find(t => t.tags_id === p.tags_id);
      toUpdate.selected = p.value;
      toUpdate.value = p.value; // TODO: decide value or selected
    });
  }
  return (
    <div className="explorer-media-picker-media-types">
      <FieldArray
        form="advanced-media-picker-search"
        name="mediaType"
        component={MediaTypesList}
        initialValues={props.initialValues}
        onChange={props.onChange}
      />
    </div>
  );
};

MediaTypesFieldArray.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  tags: PropTypes.array,
  name: PropTypes.string,
  initialValues: PropTypes.object,
  previouslySelected: PropTypes.array,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.metadata.mediaType.fetchStatus,
  // mediaType: state.system.metadata.mediaType.tags.length ? state.system.metadata.mediaType.tags : null,
  initialValues: { mediaType: state.system.metadata.mediaType.tags },
});

const fetchAsyncData = dispatch => dispatch(fetchMetadataValuesForMediaType(TAG_SET_MEDIA_TYPE));


export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      withIntlForm(
        reduxForm({ propTypes })(
          MediaTypesFieldArray
        )
      )
    )
  )
);