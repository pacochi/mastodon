import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ScrollableList from '../../components/scrollable_list';
import LoadingIndicator from '../../../mastodon/components/loading_indicator';
import AccountAuthorizeContainer from '../../../mastodon/features/follow_requests/containers/account_authorize_container';
import { fetchFollowRequests, expandFollowRequests } from '../../../mastodon/actions/accounts';

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', 'items']),
});

@connect(mapStateToProps)
export default class FollowRequests extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
  };

  componentDidMount () {
    this.props.dispatch(fetchFollowRequests());
  }

  handleScrollToBottom = () => {
    this.props.dispatch(expandFollowRequests());
  }

  render () {
    const { accountIds } = this.props;

    if (!accountIds) {
      return (
        <LoadingIndicator />
      );
    }

    const scrollableContent = (accountIds.size > 0) ? (
      accountIds.map((accountId) => (
        <AccountAuthorizeContainer key={accountId} id={accountId} />
      ))
    ) : (
      null
    );

    const emptyMessage = 'フォローリクエストはありません'; // TODO: ローカライズ

    return (
      <ScrollableList
        scrollKey='follow_requests'
        emptyMessage={emptyMessage}
        onScrollToBottom={this.handleScrollToBottom}
      >
        {scrollableContent}
      </ScrollableList>
    );
  }

}
