import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import PropTypes from 'prop-types';
import IconButton from '../icon_button';
import Link from '../link_wrapper';

export default class DropdownMenu extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  };

  state = {
    expanded: false,
  };

  setRef = (c) => {
    this.dropdown = c;
  }

  handleClick = (e) => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { action } = this.props.items[i];

    // Don't call e.preventDefault() when the item uses 'href' property.
    // ex. "Edit profile" on the account action bar

    if (typeof action === 'function') {
      e.preventDefault();
      action();
    }

    this.dropdown.hide();
  }

  handleShow = () => this.setState({ expanded: true })

  handleHide = () => this.setState({ expanded: false })

  renderItem = (item, i) => {
    if (item === null) {
      return <li key={`sep-${i}`} className='dropdown-sep' />;
    }

    const { text, to, href } = item;

    return (
      <li className='menu-item' key={`${text}-${i}`}>
        {to ? (
          <Link to={to} onClick={this.handleClick} data-index={i}>{text}</Link>
        ) : (
          <a href={href} target='_blank' rel='noopener' onClick={this.handleClick} data-index={i}>{text}</a>
        )}
      </li>
    );
  }

  render () {
    const { src, items  } = this.props;
    const { expanded } = this.state;

    const dropdownItems = expanded && (
      <ul className='menu-items'>
        {items.map(this.renderItem)}
      </ul>
    );

    return (
      <Dropdown className='dropdown-menu' ref={this.setRef} onShow={this.handleShow} onHide={this.handleHide}>
        <DropdownTrigger className='dropdown-trigger'>
          <IconButton src={src} />
        </DropdownTrigger>

        <DropdownContent className='dropdown-content'>
          {dropdownItems}
        </DropdownContent>
      </Dropdown>
    );
  }

}
