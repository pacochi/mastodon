import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import scrollTop from '../../../scroll';

class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    hideHeadingOnMobile: PropTypes.bool,
  };

  handleHeaderClick = () => {
    const scrollable = this.node.querySelector('.scrollable');

    if (!scrollable) {
      return;
    }

    this._interruptScrollAnimation = scrollTop(scrollable);
  }

  handleScroll = debounce(() => {
    if (typeof this._interruptScrollAnimation !== 'undefined') {
      this._interruptScrollAnimation();
    }
  }, 200)

  setRef = (c) => {
    this.node = c;
  }

  render () {
    const { heading, icon, children, active, hideHeadingOnMobile } = this.props;

    let columnHeaderId = null;
    let header = '';

    if (typeof heading === 'string') {
      columnHeaderId = heading.replace(/ /g, '-');
<<<<<<< HEAD
      header = <ColumnHeader icon={icon} active={active} type={heading} onClick={this.handleHeaderClick} hideOnMobile={hideHeadingOnMobile} columnHeaderId={columnHeaderId}/>;
    } else if (heading) {
      header = <ColumnHeader icon={icon} active={active} type={heading} onClick={this.handleHeaderClick} />;
=======
      header = <ColumnHeader icon={icon} active={active} type={heading} onClick={this.handleHeaderClick} hideOnMobile={hideHeadingOnMobile} columnHeaderId={columnHeaderId} />;
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
    }
    return (
      <div
        ref={this.setRef}
        role='region'
        aria-labelledby={columnHeaderId}
        className='column'
        onScroll={this.handleScroll}
      >
        {header}
        {children}
      </div>
    );
  }

}

export default Column;
