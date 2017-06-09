import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Avatar from './avatar';
import AvatarOverlay from './avatar_overlay';
import RelativeTimestamp from './relative_timestamp';
import DisplayName from './display_name';
import MediaGallery from './media_gallery';
import VideoPlayer from './video_player';
import AttachmentList from './attachment_list';
import StatusContent from './status_content';
import StatusActionBar from './status_action_bar';
import { FormattedMessage } from 'react-intl';
import emojify from '../emoji';
import escapeTextContentForBrowser from 'escape-html';
import ImmutablePureComponent from 'react-immutable-pure-component';

class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    wrapped: PropTypes.bool,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
    onDelete: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onBlock: PropTypes.func,
    onRef: PropTypes.func,
    isIntersecting: PropTypes.bool,
    me: PropTypes.number,
    boostModal: PropTypes.bool,
    autoPlayGif: PropTypes.bool,
    muted: PropTypes.bool,
    expandMedia: PropTypes.bool,
    squareMedia: PropTypes.bool,
    standalone: PropTypes.bool,
    onPin: PropTypes.func,
    displayPinned: PropTypes.bool,
  };

  state = {
    isHidden: false,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'account',
    'wrapped',
    'me',
    'boostModal',
    'autoPlayGif',
    'muted',
  ]

  updateOnStates = []

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.isIntersecting === false && nextState.isHidden) {
      // It's only if we're not intersecting (i.e. offscreen) and isHidden is true
      // that either "isIntersecting" or "isHidden" matter, and then they're
      // the only things that matter.
      return this.props.isIntersecting !== false || !this.state.isHidden;
    } else if (nextProps.isIntersecting !== false && this.props.isIntersecting === false) {
      // If we're going from a non-intersecting state to an intersecting state,
      // (i.e. offscreen to onscreen), then we definitely need to re-render
      return true;
    }
    // Otherwise, diff based on "updateOnProps" and "updateOnStates"
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isIntersecting === false && this.props.isIntersecting !== false) {
      requestIdleCallback(() => this.setState({ isHidden: true }));
    } else {
      this.setState({ isHidden: !nextProps.isIntersecting });
    }
  }

  handleRef = (node) => {
    if (this.props.onRef) {
      this.props.onRef(node);

      if (node && node.children.length !== 0) {
        this.height = node.clientHeight;
      }
    }
  }

  handleClick = () => {
    const { status } = this.props;
    this.context.router.push(`/statuses/${status.getIn(['reblog', 'id'], status.get('id'))}`);
  }

  handleAccountClick = (e) => {
    if (this.props.standalone) {
      e.preventDefault();
    } else if (e.button === 0) {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      e.preventDefault();
      this.context.router.push(`/accounts/${id}`);
    }
  }

  render () {
    let media = null;
    let statusAvatar;
    const { status, account, isIntersecting, onRef, expandMedia, squareMedia, standalone, ...other } = this.props;
    const { isHidden } = this.state;

    if (status === null) {
      return null;
    }

    if (isIntersecting === false && isHidden) {
      return (
        <div ref={this.handleRef} data-id={status.get('id')} style={{ height: `${this.height}px`, opacity: 0, overflow: 'hidden' }}>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      );
    }

    if (this.props.displayPinned && status.get('pinned')) {
      // onRefは要素の高さが変わらない場合のみ使用する
      const { displayPinned, onRef, ...otherProps } = this.props;

      return (
        <div className='status__wrapper' ref={this.handleRef} data-id={status.get('id')} >
          <div className='status__prepend'>
            <div className='status__prepend-icon-wrapper'><i className='fa fa-fw fa-pin status__prepend-icon' /></div>
            <FormattedMessage id='status.pinned' defaultMessage='Pinned Toot' className='status__display-name muted' />
          </div>

          <Status {...otherProps} />
        </div>
      );
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      let displayName = status.getIn(['account', 'display_name']);

      if (displayName.length === 0) {
        displayName = status.getIn(['account', 'username']);
      }

      const displayNameHTML = { __html: emojify(escapeTextContentForBrowser(displayName)) };

      return (
        <div className='status__wrapper' ref={this.handleRef} data-id={status.get('id')} >
          <div className='status__prepend'>
            <div className='status__prepend-icon-wrapper'><i className='fa fa-fw fa-retweet status__prepend-icon' /></div>
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} boosted' values={{ name: <a onClick={this.handleAccountClick} data-id={status.getIn(['account', 'id'])} href={status.getIn(['account', 'url'])} className='status__display-name muted'><strong dangerouslySetInnerHTML={displayNameHTML} /></a> }} />
          </div>

          <Status {...other} wrapped={true} status={status.get('reblog')} account={status.get('account')} displayPinned={false} />
        </div>
      );
    }

    let attachments = status.get('media_attachments');
    if (status.getIn(['pixiv_cards'], Immutable.List()).size > 0) {
      attachments = status.get('pixiv_cards').map(card => {
        return Immutable.fromJS({
          id: Math.random().toString(),
          preview_url: card.get('image_url'),
          remote_url: '',
          text_url: card.get('url'),
          type: 'image',
          url: card.get('image_url'),
        });
      }).concat(attachments);
    }

    if (attachments.size > 0 && !this.props.muted) {
      if (attachments.some(item => item.get('type') === 'unknown')) {

      } else if (attachments.first().get('type') === 'video') {
        media = <VideoPlayer media={attachments.first()} sensitive={status.get('sensitive')} onOpenVideo={this.props.onOpenVideo} />;
      } else {
        media = <MediaGallery media={attachments} sensitive={status.get('sensitive')} height={squareMedia ? 229 : 132} onOpenMedia={this.props.onOpenMedia} autoPlayGif={this.props.autoPlayGif} expandMedia={expandMedia} squareMedia={squareMedia} />;
      }
    }

    if (account === undefined || account === null) {
      statusAvatar = <Avatar src={status.getIn(['account', 'avatar'])} staticSrc={status.getIn(['account', 'avatar_static'])} size={48}/>;
    } else {
      statusAvatar = <AvatarOverlay staticSrc={status.getIn(['account', 'avatar_static'])} overlaySrc={account.get('avatar_static')} />;
    }

    return (
      <div className={`status ${this.props.muted ? 'muted' : ''} status-${status.get('visibility')}`} data-id={status.get('id')} ref={this.handleRef}>
        <div className='status__info'>
          <a href={status.get('url')} className='status__relative-time' target='_blank' rel='noopener'><RelativeTimestamp timestamp={status.get('created_at')} /></a>

          <a onClick={this.handleAccountClick} data-id={status.getIn(['account', 'id'])} href={status.getIn(['account', 'url'])} className='status__display-name'>
            <div className='status__avatar'>
              {statusAvatar}

            </div>

            <DisplayName account={status.get('account')} />
          </a>
        </div>

        <StatusContent status={status} onClick={this.handleClick} standalone />

        {media}

        {!standalone && <StatusActionBar {...this.props} />}
      </div>
    );
  }

}

export default Status;
