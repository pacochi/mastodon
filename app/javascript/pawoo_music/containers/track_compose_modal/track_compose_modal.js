import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrackComposeContainer from '../../containers/track_compose';
import Delay from '../../components/delay';
import { hideTrackComposeModal } from '../../actions/track_compose';

const mapStateToProps = (state) => ({
  modal: !!state.getIn(['pawoo_music', 'track_compose', 'modal']),
});

@connect(mapStateToProps)
export default class TrackComposeModal extends PureComponent {

  static propTypes = {
    modal: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleStopCompose = () => {
    this.props.dispatch(hideTrackComposeModal());
  };

  render () {
    const { modal } = this.props;

    return (
      <Delay className='track-compose-modal'>
        {modal && (
          <div className='track-compose-modal-body'>
            <TrackComposeContainer onClose={this.handleStopCompose} />
          </div>
        )}
      </Delay>
    );
  }

}
