import { connect } from 'react-redux';
import PlayControl from '../components/play_control';
import { miscFail } from '../../../actions/miscerrors';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { openModal } from '../../../actions/modal';

const messages = defineMessages({
  skipMessage: { id: 'playlist.skip.message', defaultMessage: 'Are you sure you want to skip this music?\nThis action will affect ALL the other users listening!' },
  skipConfirm: { id: 'playlist.skip.confirm', defaultMessage: 'Skip' },
});

const mapStateToProps = state => ({
  accessToken: state.getIn(['meta', 'access_token']),
  streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url']),
  isTop: false,
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onError(e){
    dispatch(miscFail(e));
  },
  confirmSkip(e){
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.skipMessage),
      confirm: intl.formatMessage(messages.skipConfirm),
      onConfirm: () => {
        api(this.getMockState).delete(`/api/v1/playlists/${this.state.targetDeck}/deck_queues/${this.state.deck.queues[0].id}`)
        .then((response)=>{
        })
        .catch((error)=>{
          this.props.onError(error);
          return error;
        });
      },
    }));
  },
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PlayControl));
