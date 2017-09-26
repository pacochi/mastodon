import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoadingIndicator from '../../../mastodon/components/loading_indicator';
import { fetchBlocks, expandBlocks } from '../../../mastodon/actions/blocks';
import ScrollableList from '../../components/scrollable_list';
import AccountContainer from '../account';

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'blocks', 'items']),
});

@connect(mapStateToProps)
export default class BlockedUsers extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
  };

  componentWillMount () {
    this.props.dispatch(fetchBlocks());
  }

  handleScrollToBottom = () => {
    this.props.dispatch(expandBlocks());
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
        <AccountContainer key={accountId} id={accountId} />
      ))
    ) : (
      null
    );

    const emptyMessage = 'ブロックしたユーザーはいません'; // TODO: ローカライズ

    return (
      <ScrollableList
        scrollKey='muted_users'
        emptyMessage={emptyMessage}
        onScrollToBottom={this.handleScrollToBottom}
      >
        {scrollableContent}
      </ScrollableList>
    );
  }

}
