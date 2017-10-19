import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import NotificationColumnSettingsContainer from '../../../mastodon/features/notifications/containers/column_settings_container';
import HomeTimelineColumnSettingsContainer from '../../../mastodon/features/home_timeline/containers/column_settings_container';
import CommunityTimelineColumnSettingsContainer from '../../../mastodon/features/community_timeline/containers/column_settings_container';
import PublicTimelineColumnSettingsContainer from '../../../mastodon/features/public_timeline/containers/column_settings_container';

const messages = defineMessages({
  notifications: { id: 'column.notifications', defaultMessage: 'Notifications' },
  home: { id: 'column.home', defaultMessage: 'Home' },
  community: { id: 'column.community', defaultMessage: 'Local timeline' },
  public: { id: 'column.public', defaultMessage: 'Federated timeline' },
});

@injectIntl
export default class TimelineSettings extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { intl } = this.props;

    return (
      <div className='timeline-settings'>
        <h3>{intl.formatMessage(messages.notifications)}</h3>
        <NotificationColumnSettingsContainer />
        <hr />

        <h3>{intl.formatMessage(messages.home)}</h3>
        <HomeTimelineColumnSettingsContainer />
        <hr />

        <h3>{intl.formatMessage(messages.community)}</h3>
        <CommunityTimelineColumnSettingsContainer />
        <hr />

        <h3>{intl.formatMessage(messages.public)}</h3>
        <PublicTimelineColumnSettingsContainer />
      </div>
    );
  }

}
