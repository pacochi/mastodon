import noop from 'lodash/noop';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import feather from 'feather-icons';

export default class IconButton extends PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    title: PropTypes.string,
    tabindex: PropTypes.number,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    title: 'icon',
    tabindex: -1,
  };

  isClickable = () => {
    const { onClick, disabled } = this.props;
    return !disabled && !!onClick;
  }

  render () {
    const { src, title, active, tabindex, className, onClick, ...other } = this.props;
    const svg = feather.toSvg(src, { 'stroke-width': 1 });
    const clickable = this.isClickable();

    return (
      <span
        dangerouslySetInnerHTML={{ __html: svg }}
        className={classNames('icon-button', `icon-button-${src}`, { clickable, active }, className)}
        onClick={clickable ? onClick : noop}
        title={title}
        role={clickable ? 'button' : 'presentation'}
        tabIndex={tabindex}
        aria-pressed='false'
        {...other}
      />
    );
  }

};
