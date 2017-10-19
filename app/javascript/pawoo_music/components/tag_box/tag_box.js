import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';

export default class TagBox extends ImmutablePureComponent {

  static propTypes = {
    heading: PropTypes.node,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  render () {
    const { heading, className, children } = this.props;

    return (
      <div className={classNames('tag-box', className)}>
        <h3>
          {heading}
        </h3>
        {children}
      </div>
    );
  }

};
