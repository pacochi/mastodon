import React from 'react';
import PropTypes from 'prop-types';

class ColumnHeader extends React.PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    type: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    hideOnMobile: PropTypes.bool,
    columnHeaderId: PropTypes.string,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render () {
    const { type, active, hideOnMobile, columnHeaderId } = this.props;

    let icon = '';

    if (this.props.icon) {
      icon = <i className={`fa fa-fw fa-${this.props.icon} column-header__icon`} />;
    }

    return (
      <div role='button heading' tabIndex='0' className={`column-header ${active ? 'active' : ''} ${hideOnMobile ? 'hidden-on-mobile' : ''}`} onClick={this.handleClick} id={columnHeaderId || null}>
        {icon}
        {type}
      </div>
    );
  }

}

<<<<<<< HEAD:app/assets/javascripts/components/features/ui/components/column_header.jsx
ColumnHeader.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.node]),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  hideOnMobile: PropTypes.bool,
  columnHeaderId: PropTypes.string
};

=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/features/ui/components/column_header.js
export default ColumnHeader;
