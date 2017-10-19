import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { fetchAccount } from '../../../mastodon/actions/accounts';
import { refreshAccountTimeline, expandAccountTimeline, refreshPinnedStatusTimeline } from '../../../mastodon/actions/timelines';
import ScrollableList from '../../components/status_list';
import Timeline from '../../components/timeline';

const mapStateToProps = (state, props) => {
  const { accountId } = props;

  return {
    accountId,
    statusIds: state.getIn(['timelines', `account:${accountId}`, 'items'], Immutable.List()),
    isLoading: state.getIn(['timelines', `account:${accountId}`, 'isLoading']),
    hasMore: !!state.getIn(['timelines', `account:${accountId}`, 'next']),
    pinnedStatusIds: state.getIn(['timelines', `account:${accountId}:pinned_status`, 'items'], Immutable.List()),
  };
};

@connect(mapStateToProps)
export default class AccountTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountId: PropTypes.number.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    gallery: PropTypes.node,
    pinnedStatusIds: ImmutablePropTypes.list,
  };

  static childContextTypes = {
    displayPinned: PropTypes.bool,
  };

  getChildContext() {
    return { displayPinned: true };
  }

  componentWillMount () {
    const { dispatch, accountId } = this.props;

    dispatch(fetchAccount(accountId));
    dispatch(refreshPinnedStatusTimeline(accountId));
    dispatch(refreshAccountTimeline(accountId));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;

    if (nextProps.accountId !== this.props.accountId && nextProps.accountId) {
      const accountId = nextProps.accountId;

      dispatch(fetchAccount(accountId));
      dispatch(refreshPinnedStatusTimeline(accountId));
      dispatch(refreshAccountTimeline(accountId));
    }
  }

  handleScrollToBottom = debounce(() => {
    const { dispatch, isLoading, hasMore, accountId } = this.props;
    if (!isLoading && hasMore) {
      dispatch(expandAccountTimeline(accountId));
    }
  }, 300, { leading: true })

  render () {
    const { statusIds, pinnedStatusIds, isLoading, hasMore, gallery } = this.props;
    const header = null;
    const prepend = null;
    const uniqueStatusIds = pinnedStatusIds.concat(statusIds).toOrderedSet().toList();

    return (
      <Timeline gallery={gallery} header={header}>
        <ScrollableList
          scrollKey='account_timeline'
          statusIds={uniqueStatusIds}
          isLoading={isLoading}
          hasMore={hasMore}
          prepend={prepend}
          onScrollToBottom={this.handleScrollToBottom}
        />
      </Timeline>
    );
  }

};
