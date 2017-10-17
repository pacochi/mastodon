import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Scrollbars } from 'react-custom-scrollbars';
import SearchBox from '../search_box';
import LoginBox from '../../components/login_box';
import IconButton from '../../components/icon_button';
import EventCalendar from '../../components/event_calendar';
import PinnedTagsContainer from '../pinned_tags';
import TrendTagsContainer from '../trend_tags';
import { isMobile } from '../../util/is_mobile';
import { changeTargetColumn } from '../../actions/column';
import Announcements from '../../components/announcements';

import logo from '../../../images/pawoo_music/pawoo_music.svg';

const icons = {
  home: 'home',
  notifications: 'bell',
  local_timeline: 'users',
  federated_timeline: 'globe',
  favourites: 'star',
  preferences: 'settings',
};

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  local_timeline: { id: 'tabs_bar.local_timeline', defaultMessage: 'Local' },
  federated_timeline: { id: 'tabs_bar.federated_timeline', defaultMessage: 'Federated' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
});

const navLinkParams = [
  { to: '/', messageKey: 'home', requireLogin: true, exact: true },
  { to: '/notifications', messageKey: 'notifications', requireLogin: true },
  { to: '/timelines/public/local', messageKey: 'local_timeline', exact: true },
  { to: '/timelines/public', messageKey: 'federated_timeline', exact: true },
  { to: '/favourites', messageKey: 'favourites', requireLogin: true },
];

const filteredNavLinkParams = navLinkParams.filter(({ requireLogin }) => !requireLogin);

const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
  target: state.getIn(['pawoo_music', 'column', 'target']),
});

@injectIntl
@connect(mapStateToProps)
export default class GlobalNavi extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLogin: PropTypes.bool,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('lobby'));
  }

  renderNavLink = (param) => {
    const { intl } = this.props;
    const { requireLogin, messageKey, ...other } = param;
    return (
      <li key={other.to}>
        <NavLink {...other} onClick={this.handleClick}>
          <div className='menu'>
            <IconButton src={icons[messageKey]} strokeWidth={2} />
            <span>{intl.formatMessage(messages[messageKey])}</span>
          </div>
        </NavLink>
      </li>
    );
  };

  renderNavLinks () {
    const { isLogin } = this.props;
    const params = isLogin ? navLinkParams : filteredNavLinkParams;
    return <ul>{params.map(this.renderNavLink)}</ul>;
  }

  render () {
    const { intl, isLogin } = this.props;
    const mobile = isMobile();
    const globalNavi = (
      <div className='global-navi'>
        <div className='global-navi-center'>
          {!mobile && (
            <img className='logo' src={logo} alt='logo' />
          )}
          <SearchBox />
          {!isLogin && <LoginBox />}
          <div className='global-navi-links'>
            {this.renderNavLinks()}
          </div>

          <h2>タグタイムライン</h2>
          <EventCalendar />
          <PinnedTagsContainer />
          <TrendTagsContainer />
          <Announcements />
        </div>
        <div className='global-navi-bottom'>
          {isLogin && (
            <a className='settings-link' href='/settings/preferences'>
              <IconButton src='settings' className='clickable' strokeWidth={2} /> &nbsp;
              <div className='settings-link-text'>
                {intl.formatMessage(messages.preferences)}
              </div>
            </a>
          )}
        </div>
      </div>
    );

    return mobile ? (
      globalNavi
    ) : (
      <Scrollbars className='scrollable'>{globalNavi}</Scrollbars>
    );
  }

};
