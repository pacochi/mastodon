import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Logo from '../../components/dummy';
import SearchBox from '../../components/dummy';
import LoginBox from '../../components/login_box';
import EventCalendar from '../../components/event_calendar';
import PinnedTagsContainer from '../../containers/pinned_tags';
import TrendTagsContainer from '../../containers/trend_tags';

export default class Navigation extends PureComponent {

  static propTypes = {
    isLogin: PropTypes.bool,
  }

  render () {
    const { isLogin } = this.props;
    const navLinkParams = [
      { to: '/', node: 'Home', requireLogin: true, exact: true },
      { to: '/notifications', node: 'Notifications', requireLogin: true },
      { to: '/timelines/public/local', node: 'CommunityTimeline', exact: true },
      { to: '/timelines/public', node: 'PublicTimeline', exact: true },
      { to: '/favourites', node: 'Favourites', requireLogin: true },
    ];

    return (
      <div className='navigation'>
        <div className='navigation-center'>
          <Logo>logo</Logo>
          <SearchBox>search</SearchBox>
          {!isLogin ? <LoginBox /> : null}
          <div className='navigation-links'>
            {navLinkParams.map((param) => {
              const { requireLogin, node, ...other } = param;

              if (!isLogin && requireLogin) {
                return null;
              }

              return <NavLink key={other.to} {...other}>{node}</NavLink>;
            })}
          </div>
          <EventCalendar />
          <PinnedTagsContainer />
          <TrendTagsContainer />
        </div>
        <div className='navigation-bottom'>
          <a href='/settings/preferences'>Settings</a>
        </div>
      </div>
    );
  }

};
