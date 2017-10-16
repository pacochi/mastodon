import noop from 'lodash/noop';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

export default class checkbox extends PureComponent {

  static propTypes = {
    checked: PropTypes.bool.isRequired,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onChange: PropTypes.func, // クリックした時のfunction
  };

  static defaultProps = {
    children: undefined,
    disabled: false,
    onChange: noop,
  };

  constructor(props, context) {
    super(props, context);
    this.uuid = uuid();
  }

  handleAssignNode = (node: Element) => {
    this.node = node;
  };

  render = () => (
    <div className='checkbox' ref={this.handleAssignNode}>
      <input className='checkbox-input' id={this.uuid} type='checkbox' onChange={this.props.onChange} checked={this.props.checked} disabled={this.props.disabled} />
      <label className='checkbox-label' htmlFor={this.uuid}>
        <div className='checkbox-label-head'>
          <div className='checkbox-label-head-check' />
        </div>
        <div className='checkbox-label-body'>
          {this.props.children}
        </div>
      </label>
    </div>
  );

}
