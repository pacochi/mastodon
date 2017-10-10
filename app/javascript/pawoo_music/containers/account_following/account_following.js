import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { fetchFollowing, expandFollowing } from '../../../mastodon/actions/accounts';
import AccountHeaderContainer from '../account_header';
import { makeGetAccount } from '../../../mastodon/selectors';
import AccountTimelineContainer from '../account_timeline';
import AccountList from '../../components/account_list';
import { updateTimelineTitle } from '../../actions/timeline';
import { changeFooterType } from '../../actions/footer';
import { changeTargetColumn } from '../../actions/column';
import { displayNameEllipsis } from '../../util/displayname_ellipsis';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => {
    const acct = props.match.params.acct;
    const accountId = Number(state.getIn(['pawoo_music', 'acct_map', acct]));

    return {
      accountId,
      account: getAccount(state, accountId),
      accountIds: state.getIn(['user_lists', 'following', accountId, 'items'], Immutable.List()),
      hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
    };
  };

  return mapStateToProps;
};

@connect(makeMapStateToProps)
export default class AccountFollowing extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountId: PropTypes.number.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    accountIds: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch, accountId, account } = this.props;
    const displayName = displayNameEllipsis(account);

    dispatch(fetchFollowing(accountId));
    dispatch(changeTargetColumn('gallery'));
    dispatch(updateTimelineTitle(`${displayName} のフォロー`)); /* TODO: intl */
    dispatch(changeFooterType('back_to_user', `/@${account.get('acct')}`));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;

    if (nextProps.accountId !== this.props.accountId && nextProps.accountId) {
      const { accountId, account } = nextProps;
      const displayName = displayNameEllipsis(account);

      dispatch(fetchFollowing(accountId));
      dispatch(updateTimelineTitle(`${displayName} のフォロー`)); /* TODO: intl */
    }
  }

  handleScrollToBottom = debounce(() => {
    const { dispatch, accountId, hasMore } = this.props;
    if (hasMore) {
      dispatch(expandFollowing(accountId));
    }
  }, 300, { leading: true });


  render () {
    const { accountId, account, accountIds, hasMore } = this.props;

    const gallery = (
      <AccountList
        scrollKey='account_followers'
        accountIds={accountIds}
        hasMore={hasMore}
        prepend={<AccountHeaderContainer account={account} />}
        onScrollToBottom={this.handleScrollToBottom}
      />
    );

    return (
      <AccountTimelineContainer accountId={accountId} gallery={gallery} />
    );
  }

};
