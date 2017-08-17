import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { fetchFavouritedStatuses, expandFavouritedStatuses } from '../../../mastodon/actions/favourites';
import Timeline from '../../components/timeline';
import ScrollableList from '../../components/status_list';
import TimelineHeader from '../../components/timeline_header';

const messages = defineMessages({
  title: { id: 'column.favourites', defaultMessage: 'Favourites' },
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'favourites', 'items']),
});

@injectIntl
@connect(mapStateToProps)
export default class Notifications extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
  };

  componentDidMount () {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  onScrollToBottom = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses());
  }, 300, { leading: true });

  render () {
    const { intl, statusIds } = this.props;

    const Garally = (
      <div>
        Garally
      </div>
    );

    const header = (
      <TimelineHeader
        icon='bell'
        title={intl.formatMessage(messages.title)}
      />
    );

    return (
      <Timeline garally={Garally} header={header}>
        <ScrollableList scrollKey='favourited_statuses' statusIds={statusIds} onScrollToBottom={this.onScrollToBottom} />
      </Timeline>
    );
  }

}
