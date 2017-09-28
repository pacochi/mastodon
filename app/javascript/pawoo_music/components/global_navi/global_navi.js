import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import SearchBox from '../../containers/search_box';
import LoginBox from '../login_box';
import EventCalendar from '../event_calendar';
import TagHistoryContainer from '../../containers/tag_history';
import TrendTagsContainer from '../../containers/trend_tags';
import { isMobile } from '../../util/is_mobile';

import logo from '../../../images/pawoo_music/logo.png';
import settingsIcon from '../../../images/pawoo_music/settings.png';

const messages = defineMessages({
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
});

const navLinkParams = [
  { to: '/', node: 'Home', requireLogin: true, exact: true },
  { to: '/notifications', node: 'Notifications', requireLogin: true },
  { to: '/timelines/public/local', node: 'CommunityTimeline', exact: true },
  { to: '/timelines/public', node: 'PublicTimeline', exact: true },
  { to: '/favourites', node: 'Favourites', requireLogin: true },
];

const filteredNavLinkParams = navLinkParams.filter(({ requireLogin }) => !requireLogin);

@injectIntl
export default class GlobalNavi extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isLogin: PropTypes.bool,
  }

  renderNavLinks () {
    const { isLogin } = this.props;
    const params = isLogin ? navLinkParams : filteredNavLinkParams;

    return (
      <ul>
        {params.map((param) => {
          const { requireLogin, node, ...other } = param;

          return <li key={other.to}><NavLink {...other}>{node}</NavLink></li>;
        })}
      </ul>
    );
  }

  render () {
    const { intl, isLogin } = this.props;
    const mobile = isMobile();

    return (
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
          <EventCalendar />
          {isLogin && <TagHistoryContainer />}
          <TrendTagsContainer />
        </div>
        <div className='global-navi-bottom'>
          {isLogin && (
            <a className='settings-link' href='/settings/preferences'>
              <img className='settings-link-icon' src={settingsIcon} alt='settings' />
              <div className='settings-link-text'>
                {intl.formatMessage(messages.preferences)}
              </div>
            </a>
          )}
        </div>
      </div>
    );
  }

};
