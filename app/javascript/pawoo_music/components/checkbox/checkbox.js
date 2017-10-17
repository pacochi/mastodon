import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

export default class Checkbox extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    circled: PropTypes.bool,
    value: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired, // クリックした時のfunction
  };

  static defaultProps = {
    children: undefined,
    disabled: false,
    circled: false,
    value: '',
  };

  constructor(props, context) {
    super(props, context);
    this.uuid = uuid();
  }

  handleAssignNode = (node) => {
    this.node = node;
  };

  render = () => (
    <div className={classNames('checkbox', { circled: this.props.circled })} ref={this.handleAssignNode}>
      <input className='checkbox-input' value={this.props.value} id={this.uuid} type='checkbox' onChange={this.props.onChange} checked={this.props.checked} disabled={this.props.disabled} />
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
