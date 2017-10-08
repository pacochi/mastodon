import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { connectUserStream } from '../../actions/streaming';
import { refreshHomeTimeline } from '../../../mastodon/actions/timelines';
import { refreshNotifications } from '../../../mastodon/actions/notifications';
import AlbumComposeContainer from '../album_compose';
import HomeTimelineContainer from '../home_timeline';
import NotificationListContainer from '../notification_list';
import CommunityTimelineContainer from '../community_timeline';
import PublicTimelineContainer from '../public_timeline';
import TrackComposeContainer from '../track_compose';
import HashtagTimelineContainer from '../hashtag_timeline';
import AccountGarallyContainer from '../account_garally';
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

const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class App extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLogin: PropTypes.bool,
  }

  constructor (props) {
    super(props);

    this.state = {
      centerView: 'lobby',
    };
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

  handleClickGlobalNaviButton = (ref) => {
    this.grobalNaviButton = ref;
    this.setState({ centerView: 'globalNavi' });
  }

  handleClickLobbyButton = (ref) => {
    this.lobbyButton = ref;
    this.setState({ centerView: 'lobby' });
  }

  handleClickGarallyButton = (ref) => {
    this.garallyButton = ref;
    this.setState({ centerView: 'garally' });
  }

  render () {
    const mobile = isMobile();
    const centerView = this.state.centerView;
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
        <Route path='/@:acct' exact component={AccountGarallyContainer} />
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
            <topnavi>
              <button className={classNames({ 'selected': centerView === 'globalNavi' })} onClick={this.handleClickGlobalNaviButton}>≡</button>
              <a href='/投稿するURL'>[ぱうロゴ]</a>
              <StatusPostButtonContainer />
            </topnavi>
          </div>
          <div className='app-bottom'>
            <div className='buttons'>
              <button className={classNames({ 'selected': centerView === 'lobby'   })} onClick={this.handleClickLobbyButton}  >チャット</button>
              <button className={classNames({ 'selected': centerView === 'garally' })} onClick={this.handleClickGarallyButton}>作品</button>
            </div>
          </div>
          <NotificationsContainer />
          <LoadingBarContainer className='loading-bar' />
          <ModalContainer />
        </div>
      ) : (
        <div className={classNames('app', { sp: mobile })}>
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
