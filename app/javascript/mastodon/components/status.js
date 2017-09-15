import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Avatar from './avatar';
import AvatarOverlay from './avatar_overlay';
import Timestamp from './timestamp';
import DisplayName from './display_name';
import MediaGallery from './media_gallery';
import VideoPlayer from './video_player';
import BoothWidget from './booth_widget';
import SCWidget from './sc_widget';
import YTWidget from './yt_widget';
import StatusContent from './status_content';
import StatusActionBar from './status_action_bar';
import { FormattedMessage } from 'react-intl';
import emojify from '../emoji';
import escapeTextContentForBrowser from 'escape-html';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
    displayPinned: PropTypes.bool,
  };

  // for reblog
  static childContextTypes = {
    displayPinned: PropTypes.bool,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
    onDelete: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onBlock: PropTypes.func,
    me: PropTypes.number,
    boostModal: PropTypes.bool,
    autoPlayGif: PropTypes.bool,
    muted: PropTypes.bool,
    expandMedia: PropTypes.bool,
    squareMedia: PropTypes.bool,
    standalone: PropTypes.bool,
    schedule: PropTypes.bool,
    onPin: PropTypes.func,
    fetchBoothItem: PropTypes.func,
    boothItem: ImmutablePropTypes.map,
  };

  static defaultProps = {
    expandMedia: false,
  };

  state = {
    isExpanded: false,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'account',
    'me',
    'boostModal',
    'autoPlayGif',
    'muted',
    'boothItem',
  ]

  updateOnStates = ['isExpanded']

  // for reblog
  getChildContext() {
    return { displayPinned: false };
  }

  componentDidMount () {
    const boothItemId = this.props.status.get('booth_item_id');

    if (!this.props.boothItem && boothItemId) {
      this.props.fetchBoothItem(boothItemId);
    }
  }

  handleClick = () => {
    const { status } = this.props;
    this.context.router.history.push(`/statuses/${status.getIn(['reblog', 'id'], status.get('id'))}`);
  }

  handleAccountClick = (e) => {
    if (this.props.standalone) {
      e.preventDefault();
    } else if (e.button === 0) {
      const acct = e.currentTarget.getAttribute('data-acct');
      e.preventDefault();
      this.context.router.history.push(`/@${acct}`);
    }
  }

  handleExpandedToggle = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render () {
    let media = null;
    let statusAvatar;

    const { status, account, ...other } = this.props;
    const { expandMedia, squareMedia, standalone, schedule } = this.props;
    const { isExpanded } = this.state;
    const { displayPinned } = this.context;

    if (status === null) {
      return null;
    }

    if (displayPinned && status.get('pinned')) {
      return (
        <div className='status__wrapper pinned' data-id={status.get('id')} >
          <div className='status__prepend'>
            <div className='status__prepend-icon-wrapper'><i className='fa fa-fw fa-pin status__prepend-icon' /></div>
            <FormattedMessage id='status.pinned' defaultMessage='Pinned Toot' className='status__display-name muted' />
          </div>

          <Status {...this.props} />
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
        <div className='status__wrapper' data-id={status.get('id')} >
          <div className='status__prepend'>
            <div className='status__prepend-icon-wrapper'><i className='fa fa-fw fa-retweet status__prepend-icon' /></div>
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} boosted' values={{ name: <a onClick={this.handleAccountClick} data-id={status.getIn(['account', 'id'])} href={status.getIn(['account', 'url'])} className='status__display-name muted'><strong dangerouslySetInnerHTML={displayNameHTML} /></a> }} />
          </div>

          <Status {...other} status={status.get('reblog')} account={status.get('account')} />
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

    const youtube_pattern = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
    const soundcloud_pattern = /soundcloud\.com\/([a-zA-Z0-9\-\_\.]+)\/([a-zA-Z0-9\-\_\.]+)(|\/)/;

    if (attachments.size > 0 && !this.props.muted) {
      if (attachments.some(item => item.get('type') === 'unknown')) {

      } else if (attachments.first().get('type') === 'video') {
        media = <VideoPlayer media={attachments.first()} sensitive={status.get('sensitive')} onOpenVideo={this.props.onOpenVideo} />;
      } else {
        media = <MediaGallery media={attachments} sensitive={status.get('sensitive')} height={squareMedia ? 229 : 132} onOpenMedia={this.props.onOpenMedia} autoPlayGif={this.props.autoPlayGif} expandMedia={expandMedia} />;
      }
    } else if (this.props.boothItem) {
      const boothItemUrl = status.get('booth_item_url');
      const boothItemId = status.get('booth_item_id');

      media = <BoothWidget url={boothItemUrl} itemId={boothItemId} boothItem={this.props.boothItem} />;
    } else if (status.get('content').match(youtube_pattern)) {
      const videoId = status.get('content').match(youtube_pattern)[1];
      media = <YTWidget videoId={videoId} />;
    } else if (status.get('content').match(soundcloud_pattern)) {
      const url = 'https://' + status.get('content').match(soundcloud_pattern)[0];
      media = <SCWidget url={url} />;
    }

    if (account === undefined || account === null) {
      statusAvatar = <Avatar src={status.getIn(['account', 'avatar'])} staticSrc={status.getIn(['account', 'avatar_static'])} size={48} />;
    } else {
      statusAvatar = <AvatarOverlay staticSrc={status.getIn(['account', 'avatar_static'])} overlaySrc={account.get('avatar_static')} />;
    }

    return (
      <div className={`status ${this.props.muted ? 'muted' : ''} status-${status.get('visibility')}`} data-id={status.get('id')}>
        <div className='status__info'>
          <a href={status.get('url')} className='status__time' target='_blank' rel='noopener'><Timestamp schedule={schedule} timestamp={status.get('created_at')} /></a>

          <a onClick={this.handleAccountClick} data-acct={status.getIn(['account', 'acct'])} href={status.getIn(['account', 'url'])} className='status__display-name'>
            <div className='status__avatar'>
              {statusAvatar}
            </div>

            <DisplayName account={status.get('account')} />
          </a>
        </div>

        <StatusContent status={status} onClick={this.handleClick} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} onHeightUpdate={this.saveHeight} standalone />

        {media}

        {!standalone && <StatusActionBar {...this.props} />}
      </div>
    );
  }

}
