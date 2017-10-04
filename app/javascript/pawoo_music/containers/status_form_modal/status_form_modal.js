import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountContainer from '../account';
import StatusFormContainer from '../status_form';
import { restoreBackupData } from '../../../mastodon/actions/compose';

const mapStateToProps = (state) => ({
  me: state.get(['compose', 'me']),
});

@connect(mapStateToProps)
export default class StatusFormModal extends React.PureComponent {

  static propTypes = {
    me: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch(restoreBackupData());
  }


  render () {
    return (
      <div className='modal-root__modal status-form-modal'>
        <AccountContainer />
        <StatusFormContainer useModal />
      </div>
    );
  }

}
