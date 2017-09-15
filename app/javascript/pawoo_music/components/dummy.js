import React from 'react';
import PropTypes from 'prop-types';

const Dummy = (props) => (
  <div>
    dummy
    {props.children}
  </div>
);

Dummy.propTypes = {
  children: PropTypes.node,
};

export default Dummy;
