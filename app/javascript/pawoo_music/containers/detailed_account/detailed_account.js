import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { makeGetAccount } from '../../../mastodon/selectors';
import { openModal } from '../../../mastodon/actions/modal';
import { followAccount, unfollowAccount } from '../../../mastodon/actions/accounts';
import AccountContainer from '../account';
import FollowButton from '../follow_button';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => {
    const { id, account } = props;

    return {
      account: account || getAccount(state, id),
    };
  };

  return mapStateToProps;
};

@connect(makeMapStateToProps)
export default class DetailedAccount extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
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
    const { account } = this.props;

    if (!account) {
      return null;
    }

    const attachments = account.get('media_attachments');
    const media = (attachments && attachments.size > 0) && (
      <div className='media'>
        {attachments.filter((attachment) => attachment.get('type') !== 'unknown').map((attachment, index) => {
          const width = 100 / attachments.size;

          const previewUrl = attachment.get('preview_url');
          const previewWidth = attachment.getIn(['meta', 'small', 'width']);

          const originalUrl = attachment.get('url');
          const originalWidth = attachment.getIn(['meta', 'original', 'width']);

          const srcSet = attachment.has('meta') ? `${originalUrl} ${originalWidth}w, ${previewUrl} ${previewWidth}w` : null;
          const sizes = `(min-width: 1025px) ${320 * (width / 100)}px, ${width}vw`;
          const style = { width: `calc(100% / ${attachments.size})` };

          return (
            <a href={originalUrl} className='media-item' key={attachment.get('id')} data-index={index}  style={style} onClick={this.handleCliclMedia}>
              <img src={previewUrl} srcSet={srcSet} sizes={sizes} alt='' />
              {attachment.get('type') === 'video' && (
                <div className='media-spoiler-video-play-icon'><i className='fa fa-play' /></div>
              )}
            </a>
          );
        })}
      </div>
    );

    return (
      <div className='detailed-account'>
        <div className={classNames('head', { 'with-media': !!media })}>
          <AccountContainer account={account} />
          <FollowButton account={account} />
        </div>
        {media}
      </div>
    );
  }

}
