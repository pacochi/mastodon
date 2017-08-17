import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusContainer from '../../../mastodon/containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ScrollableList from '../../components/scrollable_list';

export default class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
  };

  render () {
    const { statusIds, ...other } = this.props;
    const { isLoading } = other;

    const scrollableContent = (isLoading || statusIds.size > 0) ? (
      statusIds.map((statusId) => (
        <StatusContainer key={statusId} id={statusId} />
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
