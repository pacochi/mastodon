import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from './avatar';
import RelativeTimestamp from './relative_timestamp';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DisplayName from './display_name';
import MediaGallery from './media_gallery';
import VideoPlayer from './video_player';
import AttachmentList from './attachment_list';
import StatusContent from './status_content';
import StatusActionBar from './status_action_bar';
import { FormattedMessage } from 'react-intl';
import emojify from '../emoji';
import escapeTextContentForBrowser from 'escape-html';

const Status = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    status: ImmutablePropTypes.map,
    wrapped: React.PropTypes.bool,
    onReply: React.PropTypes.func,
    onFavourite: React.PropTypes.func,
    onReblog: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onOpenMedia: React.PropTypes.func,
    onOpenVideo: React.PropTypes.func,
    onBlock: React.PropTypes.func,
    me: React.PropTypes.number,
    boostModal: React.PropTypes.bool,
    autoPlayGif: React.PropTypes.bool,
    expandMedia: React.PropTypes.bool,
    squareMedia: React.PropTypes.bool,
    standalone: React.PropTypes.bool,
    muted: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  handleClick () {
    const { status } = this.props;
    this.context.router.push(`/statuses/${status.getIn(['reblog', 'id'], status.get('id'))}`);
  },

  handleAccountClick (id, e) {
    if (e.button === 0) {
      e.preventDefault();
      this.context.router.push(`/accounts/${id}`);
    }
  },

  render () {
    let media = '';
    const { status, expandMedia, squareMedia, standalone, ...other } = this.props;

    if (status === null) {
      return <div />;
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      let displayName = status.getIn(['account', 'display_name']);

      if (displayName.length === 0) {
        displayName = status.getIn(['account', 'username']);
      }

      const displayNameHTML = { __html: emojify(escapeTextContentForBrowser(displayName)) };

      return (
        <div style={{ cursor: 'default' }}>
          <div className='status__prepend'>
            <div style={{ position: 'absolute', 'left': '-26px'}}><i className='fa fa-fw fa-retweet' /></div>
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} reblogged' values={{ name: <a onClick={this.handleAccountClick.bind(this, status.getIn(['account', 'id']))} href={status.getIn(['account', 'url'])} className='status__display-name muted'><strong dangerouslySetInnerHTML={displayNameHTML} /></a> }} />
          </div>

          <Status {...other} wrapped={true} status={status.get('reblog')} />
        </div>
      );
    }

    let attachments = status.get('media_attachments');
    if (status.get('pixiv_cards').size > 0) {
      attachments = status.get('pixiv_cards').map(card => Immutable.fromJS({
        id: Math.random().toString(),
        preview_url: card.get('image_url'),
        remote_url: '',
        text_url: card.get('url'),
        type: 'image',
        url: card.get('image_url')
      }));
    }

    if (attachments.size > 0 && !this.props.muted) {
      if (attachments.some(item => item.get('type') === 'unknown')) {

      } else if (attachments.first().get('type') === 'video') {
        media = <VideoPlayer media={attachments.first()} sensitive={status.get('sensitive')} onOpenVideo={this.props.onOpenVideo} />;
      } else {
        media = <MediaGallery media={attachments} sensitive={status.get('sensitive')} height={squareMedia ? 229 : 132} onOpenMedia={this.props.onOpenMedia} autoPlayGif={this.props.autoPlayGif} expandMedia={expandMedia} squareMedia={squareMedia} />;
      }
    }

    let avatar = {};
    if (standalone) {
      avatar = {
        href: status.getIn(['account', 'url']),
        className: 'status__display-name',
        style: { display: 'block', maxWidth: '100%', paddingRight: '25px' },
        target: '_blank'
      };
    } else {
      avatar ={
        href: status.getIn(['account', 'url']),
        className: 'status__display-name',
        style: { display: 'block', maxWidth: '100%', paddingRight: '25px' },
        onClick: this.handleAccountClick.bind(this, status.getIn(['account', 'id']))
      };
    }

    return (
      <div className={this.props.muted ? 'status muted' : 'status'}>
        <div style={{ fontSize: '15px' }}>
          <div style={{ float: 'right', fontSize: '13px' }}>
            <a href={status.get('url')} className='status__relative-time' target='_blank' rel='noopener'><RelativeTimestamp timestamp={status.get('created_at')} /></a>
          </div>

          <a {...avatar}>
            <div className='status__avatar' style={{ position: 'absolute', left: '10px', top: '10px', width: '48px', height: '48px' }}>
              <Avatar src={status.getIn(['account', 'avatar'])} staticSrc={status.getIn(['account', 'avatar_static'])} size={48} />
            </div>

            <DisplayName account={status.get('account')} />
          </a>
        </div>

        <StatusContent standalone status={status} onClick={this.handleClick} />

        {media}

        {!standalone && <StatusActionBar {...this.props} />}
      </div>
    );
  }

});

export default Status;
