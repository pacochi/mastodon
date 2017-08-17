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
  const params = props.match.params;
  return {
    params,
    statusIds: state.getIn(['timelines', `account:${Number(params.accountId)}`, 'items'], Immutable.List()),
    isLoading: state.getIn(['timelines', `account:${Number(params.accountId)}`, 'isLoading']),
    hasMore: !!state.getIn(['timelines', `account:${Number(params.accountId)}`, 'next']),
    pinnedStatusIds: state.getIn(['timelines', `account:${Number(params.accountId)}:pinned_status`, 'items'], Immutable.List()),
  };
};

@connect(mapStateToProps)
export default class AccountTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    pinnedStatusIds: ImmutablePropTypes.list,
  };

  static childContextTypes = {
    displayPinned: PropTypes.bool,
  };

  getChildContext() {
    return { displayPinned: true };
  }

  componentWillMount () {
    const { dispatch, params } = this.props;
    const accountId = Number(params.accountId);

    dispatch(fetchAccount(accountId));
    dispatch(refreshPinnedStatusTimeline(accountId));
    dispatch(refreshAccountTimeline(accountId));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;

    if (nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) {
      const accountId = Number(nextProps.params.accountId);

      dispatch(fetchAccount(accountId));
      dispatch(refreshPinnedStatusTimeline(accountId));
      dispatch(refreshAccountTimeline(accountId));
    }
  }

  handleScrollToBottom = debounce(() => {
    const { dispatch, isLoading, hasMore, params } = this.props;
    if (!isLoading && hasMore) {
      dispatch(expandAccountTimeline(Number(params.accountId)));
    }
  }, 300, { leading: true })

  render () {
    const { statusIds, pinnedStatusIds, isLoading, hasMore } = this.props;

    const Garally = (
      <div>
        Garally
      </div>
    );

    const header = null;
    const prepend = null;
    const uniqueStatusIds = pinnedStatusIds.concat(statusIds).toOrderedSet().toList();

    return (
      <Timeline garally={Garally} header={header} withComposeFrom={false}>
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
