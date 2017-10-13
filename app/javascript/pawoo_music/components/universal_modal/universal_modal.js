import React from 'react';
import PropTypes from 'prop-types';

export default class UniversalModal extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render () {
    const { children } = this.props;

    return (
      <div className='modal-root__modal'>
        {children}
      </div>
    );
  }

}
