import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { connectUserStream } from '../../actions/streaming';
import { changeTargetColmun } from '../../actions/colmun';
import { refreshHomeTimeline } from '../../../mastodon/actions/timelines';
import { refreshNotifications } from '../../../mastodon/actions/notifications';
import AlbumComposeContainer from '../album_compose';
import HomeTimelineContainer from '../home_timeline';
import NotificationListContainer from '../notification_list';
import CommunityTimelineContainer from '../community_timeline';
import PublicTimelineContainer from '../public_timeline';
import TrackComposeContainer from '../track_compose';
import HashtagTimelineContainer from '../hashtag_timeline';
import AccountGalleryContainer from '../account_gallery';
import FavouritedStatusesContainer from '../favourited_statuses';
import Intent from '../../components/intent';
import LoadingBarContainer from '../../../mastodon/features/ui/containers/loading_bar_container';
import NotificationsContainer from '../../../mastodon/features/ui/containers/notifications_container';
import ModalContainer from '../../../mastodon/features/ui/containers/modal_container';
import AccountAlbumContainer from '../account_album';
import AccountTrackContainer from '../account_track';
import AccountFollowersContainer from '../account_followers';
import AccountFollowingContainer from '../account_following';
import StatusThreadContainer from '../status_thread';
import { isMobile } from '../../util/is_mobile';
import StatusPostButtonContainer from '../status_post_button';
import PlayControlContainer from '../../../mastodon/features/ui/containers/play_control_container';
import { openModalFormCompose } from '../../../mastodon/actions/compose';

import logo from '../../../images/pawoo_music/pawoo_music.svg';

const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
  target: state.getIn(['pawoo_music', 'column', 'target']),
});

@connect(mapStateToProps)

export default class App extends PureComponent {

  static propTypes = {
    target: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLogin: PropTypes.bool,
  }

  componentDidMount () {
    const { dispatch, isLogin } = this.props;

    if (isLogin) {
      this.disconnect = dispatch(connectUserStream());
      dispatch(refreshHomeTimeline());
      dispatch(refreshNotifications());

      // Desktop notifications
      if (typeof window.Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleClickGlobalNaviButton = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColmun('global_navi'));
  }

  handleClickLobbyButton = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColmun('lobby'));
  }

  handleClickGalleryButton = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColmun('gallery'));
  }

  handleClickStatusPostButton = () => {
    const { dispatch } = this.props;
    dispatch(openModalFormCompose());
  }

  render () {
    const mobile = isMobile();
    const { target } = this.props;

    const routes = (
      <Switch>
        <Route path='/' exact component={HomeTimelineContainer} />
        <Route path='/intent/statuses/new' exact component={Intent} />
        <Route path='/notifications' component={NotificationListContainer} />
        <Route path='/timelines/public/local' component={CommunityTimelineContainer} />
        <Route path='/timelines/public' exact component={PublicTimelineContainer} />
        <Route path='/albums/new' exact component={AlbumComposeContainer} />
        <Route path='/tracks/new' exact component={TrackComposeContainer} />
        <Route path='/tags/:id' exact component={HashtagTimelineContainer} />
        <Route path='/favourites' component={FavouritedStatusesContainer} />
        <Route path='/@:acct' exact component={AccountGalleryContainer} />
        <Route path='/@:acct/:id' exact component={StatusThreadContainer} />
        <Route path='/@:acct/albums/:id' exact component={AccountAlbumContainer} />
        <Route path='/@:acct/tracks/:id' exact component={AccountTrackContainer} />
        <Route path='/users/:acct/followers' exact component={AccountFollowersContainer} />
        <Route path='/users/:acct/following' exact component={AccountFollowingContainer} />
      </Switch>
    );

    return (
      mobile ? (
        <div className={classNames('app', 'sp')}>
          <div className='app-center'>
            {routes}
          </div>
          <div className='app-top'>
            <div className={classNames('to_global_navi', { 'selected': target === 'global_navi' })} role='button' tabIndex='0' onClick={this.handleClickGlobalNaviButton}>≡</div>
            <div className='logo'><img alt='logo' src={logo} /></div>
            <div className='post_status' role='button' tabIndex='0' onClick={this.handleClickStatusPostButton}>+</div>
            <a   className='post_track' href='/tracks/new'>💿</a>
          </div>
          <div className='app-bottom'>
            <div className='buttons'>
              <button className={classNames({ 'selected': target === 'lobby'   })} onClick={this.handleClickLobbyButton}  >チャット</button>
              <button className={classNames({ 'selected': target === 'gallery' })} onClick={this.handleClickGalleryButton}>作品</button>
            </div>
          </div>
          <NotificationsContainer />
          <LoadingBarContainer className='loading-bar' />
          <ModalContainer />
        </div>
      ) : (
        <div className='app'>
          <div className='app-center'>
            {routes}
          </div>
          <div className='app-bottom'>
            <PlayControlContainer />
          </div>
          <NotificationsContainer />
          <LoadingBarContainer className='loading-bar' />
          <StatusPostButtonContainer fixed />
          <ModalContainer />
        </div>
      )
    );
  }

}
