import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TimelineHeader extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node]).isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
  };

  state = {
    collapsed: true,
    animating: false,
  };

  handleToggleClick = (e) => {
    e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed, animating: true });
  }

  handleTitleClick = () => {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }
  }

  handleTransitionEnd = () => {
    this.setState({ animating: false });
  }

  render () {
    const { title, icon, active, children } = this.props;
    const { collapsed, animating } = this.state;

    const wrapperClassName = classNames('timeline-header', {
      'active': active,
    });

    const buttonClassName = classNames('header-button', {
      'active': active,
    });

    const collapsibleClassName = classNames('collapsible', {
      'collapsed': collapsed,
      'animating': animating,
    });

    const collapsibleButtonClassName = classNames('collapsible-button', {
      'active': !collapsed,
    });

    return (
      <div className={wrapperClassName}>
        <div role='button heading' className={buttonClassName} onClick={this.handleTitleClick}>
          <div className='header-title'>
            <i className={`fa fa-fw fa-${icon} header-icon`} />
            {title}
          </div>
          {children && (
            <button className={collapsibleButtonClassName} onClick={this.handleToggleClick}><i className='fa fa-sliders' /></button>
          )}
        </div>

        <div className={collapsibleClassName} onTransitionEnd={this.handleTransitionEnd}>
          <div className='collapsible-inner'>
            {(!collapsed || animating) && children}
          </div>
        </div>
      </div>
    );
  }

}
