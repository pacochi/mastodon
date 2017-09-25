import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Route, Switch } from 'react-router-dom';
import TimelineSettings from '../timeline_settings';
import FollowRequestsContainer from '../../containers/follow_requests';

export default class Settings extends ImmutablePureComponent {

  render () {
    return (
      <Switch>
        <Route path='/timeline' component={TimelineSettings} />
        <Route path='/follow_requests' exact component={FollowRequestsContainer} />
        <Route path='/blocks' exact component={TimelineSettings} />
        <Route path='/mutes' exact component={TimelineSettings} />
      </Switch>
    );
  }

}
