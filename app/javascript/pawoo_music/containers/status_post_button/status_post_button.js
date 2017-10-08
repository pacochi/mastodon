import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { openModalFormCompose } from '../../../mastodon/actions/compose';

@connect()
export default class StatusPostButton extends React.PureComponent {

  static propTypes = {
    fixed: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(openModalFormCompose());
  }

  render () {
    const { fixed } = this.props;

    return (
      <div className={classNames('status-post-button', { fixed })} role='button' tabIndex='0' aria-pressed='false' onClick={this.handleClick}>
        +
      </div>
    );
  }

}
