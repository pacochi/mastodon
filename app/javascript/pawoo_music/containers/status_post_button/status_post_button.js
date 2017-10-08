import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openModalFormCompose } from '../../../mastodon/actions/compose';

@connect()
export default class StatusPostButton extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(openModalFormCompose());
  }

  render () {
    return (
      <div className='status-post-button' role='button' tabIndex='0' aria-pressed='false' onClick={this.handleClick}>
        +
      </div>
    );
  }

}
