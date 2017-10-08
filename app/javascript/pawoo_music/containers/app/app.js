import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { connectUserStream } from '../../actions/streaming';
import { changeTargetColumn } from '../../actions/column';
import { refreshHomeTimeline } from '../../../mastodon/actions/timelines';
import { refreshNotifications } from '../../../mastodon/actions/notifications';
import HomeTimelineContainer from '../home_timeline';
import NotificationListContainer from '../notification_list';
import CommunityTimelineContainer from '../community_timeline';
import PublicTimelineContainer from '../public_timeline';
import HashtagTimelineContainer from '../hashtag_timeline';
import AccountGalleryContainer from '../account_gallery';
import FavouritedStatusesContainer from '../favourited_statuses';
import Intent from '../../components/intent';
import LoadingBarContainer from '../../../mastodon/features/ui/containers/loading_bar_container';
import NotificationsContainer from '../../../mastodon/features/ui/containers/notifications_container';
import ModalContainer from '../../../mastodon/features/ui/containers/modal_container';
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
  title: state.getIn(['pawoo_music', 'timeline', 'title']),
  footerType: state.getIn(['pawoo_music', 'footer', 'footerType']),
});

@connect(mapStateToProps)
export default class App extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    footerType: PropTypes.string.isRequired,
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
    dispatch(changeTargetColumn('global_navi'));
  }

  handleClickLobbyButton = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('lobby'));
  }

  handleClickGalleryButton = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('gallery'));
  }

  handleClickHistoryBackButton = () => {
    // History Back があればそれに戻る。
    // History Back がない、または History Back がこのドメインの外の場合は、/users/:id に戻る
  }

  handleClickStatusPostButton = () => {
    const { dispatch } = this.props;
    dispatch(openModalFormCompose());
  }


  render () {
    const mobile = isMobile();
    const { title, target, footerType } = this.props;

    const routes = (
      <Switch>
        <Route path='/' exact component={HomeTimelineContainer} />
        <Route path='/intent/statuses/new' exact component={Intent} />
        <Route path='/notifications' component={NotificationListContainer} />
        <Route path='/timelines/public/local' component={CommunityTimelineContainer} />
        <Route path='/timelines/public' exact component={PublicTimelineContainer} />
        <Route path='/tags/:id' exact component={HashtagTimelineContainer} />
        <Route path='/favourites' component={FavouritedStatusesContainer} />
        <Route path='/@:acct' exact component={AccountGalleryContainer} />
        <Route path='/@:acct/:id' exact component={StatusThreadContainer} />
        <Route path='/users/:acct/followers' exact component={AccountFollowersContainer} />
        <Route path='/users/:acct/following' exact component={AccountFollowingContainer} />
      </Switch>
    );

    let buttons = null;

    if(mobile) {
      if(footerType === 'lobby_gallery') {
        buttons = (
          <div className='buttons'>
            <button className={classNames({ 'selected': target === 'lobby'   })} onClick={this.handleClickLobbyButton}  >チャット</button>
            <button className={classNames({ 'selected': target === 'gallery' })} onClick={this.handleClickGalleryButton}>作品</button>
          </div>
        );

      } else if(footerType === 'back_to_user') {
        buttons = (
          <div className='buttons'>
            <a href='./' className='selected'>戻る</a>
          </div>
        );

      } else { // Do same action as (footerType === 'history_back')
        buttons = (
          <div className='buttons'>
            <button className='selected' onClick={this.handleClickHistoryBackButton}>戻る</button>
          </div>
        );
      }
    }

    return (
      mobile ? (
        <div className={classNames('app', 'sp')}>

          <div className='app-center'>{routes}</div>

          <div className='app-top'>
            <div className={classNames('to_global_navi', { 'selected': target === 'global_navi' })} role='button' tabIndex='0' onClick={this.handleClickGlobalNaviButton}>≡</div>
            <div className='logo'>
              <img alt='logo' src={logo} />
              <div className='timeline_title'>{title}</div>
            </div>
            <div className='post_status' role='button' tabIndex='0' onClick={this.handleClickStatusPostButton}>+</div>
            <a   className='post_track' href='/tracks/new'>💿</a>
          </div>

          <div className='app-bottom'>{buttons}</div>

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
