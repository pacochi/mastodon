import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Route, Switch } from 'react-router-dom';
import TimelineSettings from '../timeline_settings';
import FollowRequestsContainer from '../../containers/follow_requests';
import MutedUsersContainer from '../../containers/muted_users';
import BlockedUsersContainer from '../../containers/blocked_users';

export default class Settings extends ImmutablePureComponent {

  render () {
    return (
      <Switch>
        <Route path='/settings/timeline' component={TimelineSettings} />
        <Route path='/settings/follow_requests' exact component={FollowRequestsContainer} />
        <Route path='/settings/blocks' exact component={BlockedUsersContainer} />
        <Route path='/settings/mutes' exact component={MutedUsersContainer} />
      </Switch>
    );
  }

}
