import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createSelector } from 'reselect';
import { debounce } from 'lodash';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { expandNotifications, scrollTopNotifications } from '../../../mastodon/actions/notifications';
import NotificationContainer from '../../../mastodon/features/notifications/containers/notification_container';
import Timeline from '../../components/timeline';
import ScrollableList from '../../components/scrollable_list';
import TimelineHeader from '../../components/timeline_header';
import ColumnSettingsContainer from '../../../mastodon/features/notifications/containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.notifications', defaultMessage: 'Notifications' },
});

const getNotifications = createSelector([
  state => Immutable.List(state.getIn(['settings', 'notifications', 'shows']).filter(item => !item).keys()),
  state => state.getIn(['notifications', 'items']),
], (excludedTypes, notifications) => notifications.filterNot(item => excludedTypes.includes(item.get('type'))));

const mapStateToProps = state => ({
  notifications: getNotifications(state),
  isLoading: state.getIn(['notifications', 'isLoading'], true),
  hasUnread: state.getIn(['notifications', 'unread']) > 0,
  hasMore: !!state.getIn(['notifications', 'next']),
});

@injectIntl
@connect(mapStateToProps)
export default class NotificationList extends ImmutablePureComponent {

  static propTypes = {
    notifications: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    hasUnread: PropTypes.bool,
    hasMore: PropTypes.bool,
  };

  handleScrollToBottom = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false));
    this.props.dispatch(expandNotifications());
  }, 300, { leading: true });

  handleScrollToTop = debounce(() => {
    this.props.dispatch(scrollTopNotifications(true));
  }, 100);

  handleScroll = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false));
  }, 100);

  render () {
    const { notifications, isLoading, hasMore, intl, hasUnread } = this.props;

    let scrollableContent = null;

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent;
    } else if (notifications.size > 0) {
      scrollableContent = notifications.map((item) => <NotificationContainer key={item.get('id')} notification={item} accountId={item.get('account')} />);
    } else {
      scrollableContent = null;
    }

    this.scrollableContent = scrollableContent;

    const emptyMessage = <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. Interact with others to start the conversation." />;

    const Garally = (
      <div>
        Garally
      </div>
    );

    const header = (
      <TimelineHeader
        icon='bell'
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
      >
        <ColumnSettingsContainer />
      </TimelineHeader>
    );

    return (
      <Timeline garally={Garally} header={header}>
        <ScrollableList
          scrollKey='notifications'
          isLoading={isLoading}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
          onScrollToBottom={this.handleScrollToBottom}
          onScrollToTop={this.handleScrollToTop}
          onScroll={this.handleScroll}
        >
          {scrollableContent}
        </ScrollableList>
      </Timeline>
    );
  }

}
