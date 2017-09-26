import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ScrollableList from '../scrollable_list';
import AccountContainer from '../../containers/account';

export default class AccountList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    accountIds: ImmutablePropTypes.list.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
  };

  render () {
    const { accountIds, ...other } = this.props;
    const { isLoading } = other;

    const scrollableContent = (isLoading || accountIds.size > 0) ? (
      accountIds.map((accountId) => (
        <AccountContainer key={accountId} id={accountId} />
      ))
    ) : (
      null
    );

    return (
      <ScrollableList {...other}>
        {scrollableContent}
      </ScrollableList>
    );
  }

}
