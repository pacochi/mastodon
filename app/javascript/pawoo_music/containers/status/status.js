import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { openModal } from '../../../mastodon/actions/modal';
import { makeGetStatus } from '../../../mastodon/selectors';
import Timestamp from '../../../mastodon/components/timestamp';
import StatusContent from '../../../mastodon/components/status_content';
import StatusActionBar from '../status_action_bar';
import MediaGallery from '../../../mastodon/components/media_gallery';
import VideoPlayer from '../../../mastodon/components/video_player';
import AccountContainer from '../account';
import DisplayName from '../../components/display_name';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => {
    const { id, status } = props;

    return {
      status: status || getStatus(state, id),
      me: state.getIn(['meta', 'me']),
      autoPlayGif: state.getIn(['meta', 'auto_play_gif']) || false,
    };
  };

  return mapStateToProps;
};

@connect(makeMapStateToProps)
export default class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
    displayPinned: PropTypes.bool,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    me: PropTypes.number,
    autoPlayGif: PropTypes.bool,
    muted: PropTypes.bool,
    expandMedia: PropTypes.bool,
    squareMedia: PropTypes.bool,
    schedule: PropTypes.bool,
    // fetchBoothItem: PropTypes.func,
    // boothItem: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isExpanded: false,
  }

  handleExpandedToggle = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleClick = () => {
    let { status } = this.props;
    if (status.get('reblog')) {
      status = status.get('reblog');
    }

    this.context.router.history.push(`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`);
  }

  handleOpenMedia = (media, index) => {
    const { dispatch } = this.props;
    dispatch(openModal('MEDIA', { media, index }));
  }

  handleOpenVideo = (media, time) => {
    const { dispatch } = this.props;
    dispatch(openModal('VIDEO', { media, time }));
  }

  render () {
    const { muted, schedule } = this.props;
    const { isExpanded } = this.state;
    const { displayPinned } = this.context;
    let { status } = this.props;
    let media = null;
    let prepend = null;

    if (!status) {
      return null;
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      const name = (
        <a
          onClick={this.handleAccountClick}
          data-id={status.getIn(['account', 'id'])}
          href={status.getIn(['account', 'url'])}
        >
          <DisplayName account={status.get('account')} />
        </a>
      );

      prepend = (
        <div className='prepend-inline'>
          <i className='fa fa-fw fa-retweet status__prepend-icon' />
          <FormattedMessage id='status.reblogged_by' defaultMessage='{name} boosted' values={{ name }} />
        </div>
      );
      status = status.get('reblog');
    } else if (displayPinned && status.get('pinned')) {
      prepend = (
        <div className='prepend-inline'>
          <i className='fa fa-fw fa-thumb-tack' />
          <FormattedMessage id='status.pinned' defaultMessage='Pinned Toot' className='status__display-name muted' />
        </div>
      );
    }

    let attachments = status.get('media_attachments');
    if (attachments.size === 0 && status.getIn(['pixiv_cards'], Immutable.List()).size > 0) {
      attachments = status.get('pixiv_cards').map(card => {
        return Immutable.fromJS({
          id: Math.random().toString(),
          preview_url: card.get('image_url'),
          remote_url: '',
          text_url: card.get('url'),
          type: 'image',
          url: card.get('image_url'),
        });
      });
    }

    if (attachments.size > 0 && !this.props.muted) {
      if (attachments.some(item => item.get('type') === 'unknown')) {

      } else if (attachments.first().get('type') === 'video') {
        media = <VideoPlayer media={attachments.first()} sensitive={status.get('sensitive')} onOpenVideo={this.handleOpenVideo} />;
      } else {
        media = <MediaGallery media={attachments} sensitive={status.get('sensitive')} height={132} onOpenMedia={this.handleOpenMedia} autoPlayGif={this.props.autoPlayGif} />;
      }
    }

    return (
      <div className={classNames('status', { muted }, `status-${status.get('visibility')}`)} data-id={status.get('id')}>
        {prepend}
        <div className='status-head'>
          <AccountContainer account={status.get('account')} />
          <a href={status.get('url')} className='status-time' target='_blank' rel='noopener'>
            <Timestamp schedule={schedule} timestamp={status.get('created_at')} />
          </a>
        </div>
        <StatusContent status={status} onClick={this.handleClick} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} />

        {media}

        <StatusActionBar status={status} />
      </div>
    );
  }

}
