import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import ControlBar from './controlbar/SourceControlBar';

const PageWrapper = (props) => {
  const { children, goToAdvancedSearch } = props;
  return (
    <div>
      <ControlBar onAdvancedSearchSelected={goToAdvancedSearch} />
      {children}
    </div>
  );
};

PageWrapper.propTypes = {
  children: React.PropTypes.node,
  goToAdvancedSearch: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  goToAdvancedSearch: (values) => {
    dispatch(push(`/collections/create/advancedSearch?${values}`));
  },
});

export default
  injectIntl(
    connect(null, mapDispatchToProps)(
      PageWrapper
    ),
  );
