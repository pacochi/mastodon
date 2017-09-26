import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '../../components/link_wrapper';
import Avatar from '../../components/avatar';
import DisplayName from '../../components/display_name';
import FollowButton from '../../components/follow_button/';
import { makeGetAccount } from '../../../mastodon/selectors';
import { openModal } from '../../../mastodon/actions/modal';
import { followAccount, unfollowAccount } from '../../../mastodon/actions/accounts';

const mapStateToProps = (state, props) => {
  const { id, account } = props;
  const getAccount = makeGetAccount();

  return {
    account: account || getAccount(state, id),
    me: state.getIn(['meta', 'me']),
    autoPlayGif: state.getIn(['meta', 'auto_play_gif']),
  };
};

@connect(mapStateToProps)
export default class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    me: PropTypes.number,
    autoPlayGif: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  handleFollow = (account) => {
    const { dispatch } = this.props;

    if (account.getIn(['relationship', 'following'])) {
      dispatch(unfollowAccount(account.get('id')));
    } else {
      dispatch(followAccount(account.get('id')));
    }
  }

  handleCliclMedia = (e) => {
    const { dispatch, account } = this.props;
    const index = Number(e.currentTarget.getAttribute('data-index'));
    const media = account.getIn(['media_attachments', index]);
    if (media.get('type') === 'video') {
      dispatch(openModal('VIDEO', { media, time: 0 }));
    } else {
      dispatch(openModal('MEDIA', { media: Immutable.List([media]), index: 0 }));
    }
    e.preventDefault();
  }

  render () {
    const { account, me, autoPlayGif } = this.props;

    if (!account) {
      return null;
    }

    const lockedIcon = account.get('locked') ? <i className='fa fa-lock' /> : null;
    const attachments = account.get('media_attachments');
    const media = (attachments && attachments.size > 0) ? (
      <div className='media'>
        {attachments.filter((attachment) => attachment.get('type') !== 'unknown').map((attachment, index) => {
          const width = (100 - (attachments.size - 1)) / attachments.size;
          const height = 100;
          const top    = 'auto';
          const left = `${index}%`;
          const bottom = 'auto';
          const right  = 'auto';

          const previewUrl = attachment.get('preview_url');
          const previewWidth = attachment.getIn(['meta', 'small', 'width']);

          const originalUrl = attachment.get('url');
          const originalWidth = attachment.getIn(['meta', 'original', 'width']);

          const srcSet = attachment.has('meta') ? `${originalUrl} ${originalWidth}w, ${previewUrl} ${previewWidth}w` : null;
          const sizes = `(min-width: 1025px) ${320 * (width / 100)}px, ${width}vw`;
          const style = { left, top, right, bottom, width: `${width}%`, height: `${height}%` };

          return (
            <a href={originalUrl} className='media-item' key={attachment.get('id')} data-index={index}  style={style} onClick={this.handleCliclMedia}>
              <img src={previewUrl} srcSet={srcSet} sizes={sizes} alt='' />
            </a>
          );
        })}
      </div>
    ) : null;

    return (
      <div className='account'>
        <div className='info'>
          <Avatar className='thumb' account={account} autoPlayGif={autoPlayGif} />
          <Link className='account-link' to={`/@${account.get('acct')}`}>
            <DisplayName account={account} />
            <span className='username'>@{account.get('acct')} {lockedIcon}</span>
          </Link>

          <FollowButton me={me} account={account} onFollow={this.handleFollow} />
        </div>

        {media}
      </div>
    );
  }

}
