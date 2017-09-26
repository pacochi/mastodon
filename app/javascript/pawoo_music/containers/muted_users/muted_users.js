import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoadingIndicator from '../../../mastodon/components/loading_indicator';
import { fetchMutes, expandMutes } from '../../../mastodon/actions/mutes';
import ScrollableList from '../../components/scrollable_list';
import AccountContainer from '../account';

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'mutes', 'items']),
});

@connect(mapStateToProps)
export default class MutedUsers extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
  };

  componentWillMount () {
    this.props.dispatch(fetchMutes());
  }

  handleScrollToBottom = () => {
    this.props.dispatch(expandMutes());
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

    const emptyMessage = 'ミュートしたユーザーはいません'; // TODO: ローカライズ

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
