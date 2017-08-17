import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBox from '../dummy';
import EventCalendar from '../event_calendar';
import PinnedTagsContainer from '../../containers/pinned_tags';
import TrendTagsContainer from '../../containers/trend_tags';

export default class Navigation extends PureComponent {

  render () {
    return (
      <div className='navigation'>
        <div className='navigation-center'>
          <SearchBox>search</SearchBox>
          <div className='navigation-links'>
            <NavLink to='/' exact>Home</NavLink>
            <NavLink to='/notifications'>Notifications</NavLink>
            <NavLink to='/timelines/public/local'>CommunityTimeline</NavLink>
            <NavLink to='/timelines/public' exact>PublicTimeline</NavLink>
            <NavLink to='/favourites'>Favourites</NavLink>
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
