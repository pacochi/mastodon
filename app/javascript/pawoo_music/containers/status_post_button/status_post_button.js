import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { openModalFormCompose } from '../../../mastodon/actions/compose';
import IconButton from '../../components/icon_button';

const mapStateToProps = (state) => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class StatusPostButton extends React.PureComponent {

  static propTypes = {
    fixed: PropTypes.bool,
    isLogin: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(openModalFormCompose());
  }

  handleRedirectLoginPage = () => {
    location.href = '/auth/sign_in';
  }

  render () {
    const { fixed, isLogin } = this.props;

    return (
      <IconButton
        src='plus'
        className={classNames('status-post-button', { fixed })}
        role='button'
        tabIndex='0'
        aria-pressed='false'
        onClick={isLogin ? this.handleClick : this.handleRedirectLoginPage}
      />
    );
  }

}
