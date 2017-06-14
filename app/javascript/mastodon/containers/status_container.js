import React from 'react';
import { connect } from 'react-redux';
import Status from '../components/status';
import { makeGetStatus } from '../selectors';
import {
  replyCompose,
  mentionCompose,
} from '../actions/compose';
import {
  reblog,
  favourite,
  unreblog,
  unfavourite,
} from '../actions/interactions';
import {
  blockAccount,
  muteAccount,
} from '../actions/accounts';
import {
  fetchBoothItem,
} from '../actions/booth_items';
import { muteStatus, unmuteStatus, deleteStatus, pinStatus, unpinStatus } from '../actions/statuses';
import { initReport } from '../actions/reports';
import { openModal } from '../actions/modal';
import { createSelector } from 'reselect';
import { isMobile } from '../is_mobile';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  muteConfirm: { id: 'confirmations.mute.confirm', defaultMessage: 'Mute' },
  unpinConfirm: { id: 'confirmations.unpin.confirm', defaultMessage: 'Unpin' },
  pinConfirm: { id: 'confirmations.pin.confirm', defaultMessage: 'Pin' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => {
    const status = getStatus(state, props.id);

    return {
      status: status,
      me: state.getIn(['meta', 'me']),
      boostModal: state.getIn(['meta', 'boost_modal']),
      deleteModal: state.getIn(['meta', 'delete_modal']),
      autoPlayGif: state.getIn(['meta', 'auto_play_gif']) || false,
      boothItem: state.getIn(['booth_items', status.get('booth_item_id')]),
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onReply (status, router) {
    dispatch(replyCompose(status, router));
  },

  onModalReblog (status) {
    dispatch(reblog(status));
  },

  onReblog (status, e) {
    if (status.get('reblogged')) {
      dispatch(unreblog(status));
    } else {
      if (e.shiftKey || !this.boostModal) {
        this.onModalReblog(status);
      } else {
        dispatch(openModal('BOOST', { status, onReblog: this.onModalReblog }));
      }
    }
  },

  onFavourite (status) {
    if (status.get('favourited')) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  },

  onDelete (status) {
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteMessage),
      confirm: intl.formatMessage(messages.deleteConfirm),
      onConfirm: () => dispatch(deleteStatus(status.get('id'))),
    }));
  },

  onMention (account, router) {
    dispatch(mentionCompose(account, router));
  },

  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo (media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onBlock (account) {
    dispatch(openModal('CONFIRM', {
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.get('id'))),
    }));
  },

  onReport (status) {
    dispatch(initReport(status.get('account'), status));
  },

  onMute (account) {
    dispatch(openModal('CONFIRM', {
      message: <FormattedMessage id='confirmations.mute.message' defaultMessage='Are you sure you want to mute {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.muteConfirm),
      onConfirm: () => dispatch(muteAccount(account.get('id'))),
    }));
  },

  onMuteConversation (status) {
    if (status.get('muted')) {
      dispatch(unmuteStatus(status.get('id')));
    } else {
      dispatch(muteStatus(status.get('id')));
    }
  },

  onPin (status) {
    if (status.get('pinned')) {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.unpin.message' defaultMessage='Unpin from your profile. Are you sure?' />,
        confirm: intl.formatMessage(messages.unpinConfirm),
        onConfirm: () => dispatch(unpinStatus(status.get('id'))),
      }));
    } else {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.pin.message' defaultMessage='This will prepend any previously pinned Toot. Are you sure?' />,
        confirm: intl.formatMessage(messages.pinConfirm),
        onConfirm: () => dispatch(pinStatus(status.get('id'))),
      }));
    }
  },

  fetchBoothItem(id) {
    dispatch(fetchBoothItem(id));
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Status));
