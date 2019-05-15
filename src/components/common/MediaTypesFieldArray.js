import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import { injectIntl } from 'react-intl';
import withIntlForm from './hocs/IntlForm';
import withAsyncData from './hocs/AsyncDataContainer';
import DataCard from './DataCard';
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
          <small>{fieldObject.description}</small>
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
  const metaAndSelected = { ...props.initialValues };
  if (props.previouslySelected && props.previouslySelected.mediaType) {
    props.previouslySelected.mediaType.forEach((p) => {
      const toUpdate = metaAndSelected.mediaType.findIndex(t => t.tags_id === p.tags_id);
      if (toUpdate > -1) {
        metaAndSelected.mediaType[toUpdate].selected = p.value;
        metaAndSelected.mediaType[toUpdate].value = p.value;
      }
    });
  }
  return (
    <DataCard className="media-picker-filter-options explorer-media-picker-media-types">
      <FieldArray
        form="advanced-media-picker-search"
        name="mediaType"
        component={MediaTypesList}
        initialValues={metaAndSelected}
        onChange={props.onChange}
      />
    </DataCard>
  );
};

MediaTypesFieldArray.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  tags: PropTypes.array,
  name: PropTypes.string,
  initialValues: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  previouslySelected: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
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
