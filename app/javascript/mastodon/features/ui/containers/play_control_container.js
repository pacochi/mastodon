import { connect } from 'react-redux';
import PlayControl from '../components/play_control';
import { miscFail } from '../../../actions/miscerrors';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { openModal } from '../../../actions/modal';
import { skipMusicItem } from '../actions/play_control';

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
  onSkip(e, targetDeck, id){
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.skipMessage),
      confirm: intl.formatMessage(messages.skipConfirm),
      onConfirm: () => dispatch(skipMusicItem(e, targetDeck, id)),
    }));
  },
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PlayControl));
