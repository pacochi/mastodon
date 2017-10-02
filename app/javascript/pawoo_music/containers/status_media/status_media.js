import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openModal } from '../../../mastodon/actions/modal';
import MediaGallery from '../../../mastodon/components/media_gallery';
import VideoPlayer from '../../../mastodon/components/video_player';
import CardContainer from '../../../mastodon/features/status/containers/card_container';

const mapStateToProps = (state) => ({
  autoPlayGif: state.getIn(['meta', 'auto_play_gif']) || false,
});

@connect(mapStateToProps)
export default class StatusMedia extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    autoPlayGif: PropTypes.bool,
    detail: PropTypes.bool,
    // fetchBoothItem: PropTypes.func,
    // boothItem: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    detail: false,
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
    const { status, detail } = this.props;
    let media = null;

    if (!status) {
      return null;
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

    if (attachments.size > 0) {
      if (attachments.some(item => item.get('type') === 'unknown')) {

      } else if (attachments.first().get('type') === 'video') {
        const height = detail ? 300 : 239;
        media = <VideoPlayer media={attachments.first()} sensitive={status.get('sensitive')} height={height} onOpenVideo={this.handleOpenVideo} />;
      } else {
        const height = detail ? 300 : 132;
        media = <MediaGallery media={attachments} sensitive={status.get('sensitive')} height={height} onOpenMedia={this.handleOpenMedia} autoPlayGif={this.props.autoPlayGif} expandMedia={detail} />;
      }
    }

    if (detail && !media) {
      if (status.get('spoiler_text').length === 0) {
        media = <CardContainer statusId={status.get('id')} />;
      }
    }

    if (!media) {
      return null;
    }

    return (
      <div className='status-media'>
        {media}
      </div>
    );
  }

}
