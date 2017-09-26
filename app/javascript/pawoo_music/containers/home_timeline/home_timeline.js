import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Link from '../../components/link_wrapper';
import { changeSetting } from '../../../mastodon/actions/settings';
import { expandHomeTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import TimelineHeader from '../../components/timeline_header';
import ColumnSettingsContainer from '../../../mastodon/features/home_timeline/containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
  hasFollows: state.getIn(['accounts_counters', state.getIn(['meta', 'me']), 'following_count']) > 0,
});

@injectIntl
@connect(mapStateToProps)
export default class HomeTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    hasFollows: PropTypes.bool.isRequired,
  };

  handleLoadMore = () => {
    this.props.dispatch(expandHomeTimeline());
  }

  handleChange = (key, value) => {
    this.props.dispatch(changeSetting(['home', ...key], value));
  }

  render () {
    const { intl, hasFollows, hasUnread } = this.props;

    const emptyMessage = hasFollows ? (
      <FormattedMessage id='empty_column.home.inactivity' defaultMessage='Your home feed is empty. If you have been inactive for a while, it will be regenerated for you soon.' />
    ) : (
      <FormattedMessage
        id='empty_column.home'
        defaultMessage="You aren't following anyone yet. Visit {public} or use search to get started and meet other users."
        values={{ public: <Link to='/timelines/public'><FormattedMessage id='empty_column.home.public_timeline' defaultMessage='the public timeline' /></Link> }}
      />
    );

    const header = (
      <TimelineHeader
        icon='home'
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
      >
        <ColumnSettingsContainer />
      </TimelineHeader>
    );

    return (
      <StatusTimelineContainer
        timelineId='home'
        loadMore={this.handleLoadMore}
        header={header}
        emptyMessage={emptyMessage}
      />
    );
  }

};
