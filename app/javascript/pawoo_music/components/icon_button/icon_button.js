import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class IconButton extends PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    title: 'icon button',
  };

  handleClick = (e) => {
    const { onClick, disabled } = this.props;
    if (!disabled && onClick) {
      onClick(e);
    }
  }

  render () {
    const { src, title, className } = this.props;

    return (
      <img src={src} alt={title} className={classNames('icon-button', className)} role='button' tabIndex='0' aria-pressed='false' onClick={this.handleClick} />
    );
  }

};
