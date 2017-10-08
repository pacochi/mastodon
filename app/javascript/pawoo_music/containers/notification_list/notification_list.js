import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createSelector } from 'reselect';
import { debounce } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { expandNotifications, scrollTopNotifications } from '../../../mastodon/actions/notifications';
import NotificationContainer from '../notification';
import Timeline from '../../components/timeline';
import StatusList from '../../components/status_list';
import ScrollableList from '../../components/scrollable_list';

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

@connect(mapStateToProps)
export default class NotificationList extends ImmutablePureComponent {

  static propTypes = {
    notifications: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
  };

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandNotifications());
  }, 300, { leading: true });

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
    const { notifications, isLoading, hasMore } = this.props;

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
    const uniqueStatusIds = notifications.map((notification) => notification.get('status')).filter((status) => status).toOrderedSet().toList();

    const gallery = (
      <StatusList
        scrollKey='account_gallery'
        statusIds={uniqueStatusIds}
        hasMore={hasMore}
        isLoading={isLoading}
        detail
        onScrollToBottom={this.handleLoadMore}
      />
    );

    return (
      <Timeline gallery={gallery}>
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
