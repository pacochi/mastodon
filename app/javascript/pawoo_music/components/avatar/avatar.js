import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default class Avatar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    autoPlayGif: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    autoPlayGif: false,
  }

  state = {
    isHovered: false,
  };

  handleMouseOver = () => {
    if (!this.state.isHovered) {
      this.setState({ isHovered: true });
    }
  }

  handleMouseOut = () => {
    if (this.state.isHovered) {
      this.setState({ isHovered: false });
    }
  }

  render () {
    const { account, autoPlayGif, className } = this.props;
    const { isHovered } = this.state;

    return (
      <Link
        className={classNames('avatar', className)}
        to={`/@${account.get('acct')}`}
        style={{ backgroundImage: `url(${autoPlayGif || isHovered ? account.get('avatar') : account.get('avatar_static')})` }}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onFocus={this.handleMouseOver}
        onBlur={this.handleMouseOut}
      />
    );
  }

};
