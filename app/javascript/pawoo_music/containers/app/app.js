import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { connectUserStream } from '../../actions/streaming';
import { refreshHomeTimeline } from '../../../mastodon/actions/timelines';
import { refreshNotifications } from '../../../mastodon/actions/notifications';
import HomeTimelineContainer from '../home_timeline';
import NotificationListContainer from '../notification_list';
import CommunityTimelineContainer from '../community_timeline';
import PublicTimelineContainer from '../public_timeline';
import HashtagTimelineContainer from '../hashtag_timeline';
import AccountTimelineContainer from '../account_timeline';
import FavouritedStatusesContainer from '../favourited_statuses';
import Intent from '../../components/intent';
import Navigation from '../../components/navigation';
import MusicPlayer from '../../components/dummy';
import LoadingBarContainer from '../../../mastodon/features/ui/containers/loading_bar_container';
import NotificationsContainer from '../../../mastodon/features/ui/containers/notifications_container';
import ModalContainer from '../../../mastodon/features/ui/containers/modal_container';
import AccountFollowersContainer from '../account_followers';
import AccountFollowingContainer from '../account_following';


const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class App extends PureComponent {

  static propTypes = {
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

  render () {
    const { isLogin } = this.props;

    return (
      <div className='app'>
        <div className='app-center'>
          <Navigation isLogin={isLogin} />
          <div className='app-content'>
            <Switch>
              <Route path='/' exact component={HomeTimelineContainer} />
              <Route path='/intent/statuses/new' exact component={Intent} />
              <Route path='/notifications' component={NotificationListContainer} />
              <Route path='/timelines/public/local' component={CommunityTimelineContainer} />
              <Route path='/timelines/public' exact component={PublicTimelineContainer} />
              <Route path='/tags/:id' exact component={HashtagTimelineContainer} />
              <Route path='/favourites' component={FavouritedStatusesContainer} />
              <Route path='/@:acct' exact component={AccountTimelineContainer} />
              <Route path='/users/:acct/followers' exact component={AccountFollowersContainer} />
              <Route path='/users/:acct/following' exact component={AccountFollowingContainer} />
            </Switch>
          </div>
        </div>
        <div className='app-bottom'>
          <MusicPlayer>music player</MusicPlayer>
        </div>
        <NotificationsContainer />
        <LoadingBarContainer className='loading-bar' />
        <ModalContainer />
      </div>
    );
  }

}
