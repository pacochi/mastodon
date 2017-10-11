import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import feather from 'feather-icons';

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
      <span
        dangerouslySetInnerHTML={{
          __html: feather.toSvg(src, {
            'stroke-width': 1,
          }),
        }}
      className={classNames('icon-button', className)} title={title} role='button' tabIndex='0' aria-pressed='false' onClick={this.handleClick}
      />
    );
  }

};
