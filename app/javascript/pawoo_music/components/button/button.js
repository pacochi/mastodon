import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from '../link_wrapper';
import classNames from 'classnames';

export default class Button extends PureComponent {

  static propTypes = {
    href: PropTypes.string,
    onClick: PropTypes.func,
    target: PropTypes.string,
    reactRouter: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  render () {
    const { href, onClick, target, reactRouter, disabled, className, children } = this.props;
    const buttonClassName = classNames('button', className);

    if (href && !disabled) {
      if (reactRouter) {
        return <Link className={buttonClassName} to={href}>{children}</Link>;
      } else {
        return <a className={buttonClassName} href={href} onClick={onClick} target={target} >{children}</a>;
      }
    } else if (onClick) {
      return <button className={buttonClassName} onClick={onClick} disabled={disabled}>{children}</button>;
    } else {
      return null;
    }
  }

};
