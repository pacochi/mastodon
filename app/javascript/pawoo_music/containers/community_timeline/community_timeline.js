import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { refreshCommunityTimeline, expandCommunityTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import { connectCommunityStream } from '../../actions/streaming';
import TimelineHeader from '../../components/timeline_header';
import ColumnSettingsContainer from '../../../mastodon/features/community_timeline/containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'community', 'unread']) > 0,
});

@injectIntl
@connect(mapStateToProps)
export default class CommunityTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(refreshCommunityTimeline());
    this.disconnect = dispatch(connectCommunityStream());
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = () => {
    this.props.dispatch(expandCommunityTimeline());
  }

  render () {
    const { intl, hasUnread } = this.props;

    const header = (
      <TimelineHeader
        icon='users'
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
      >
        <ColumnSettingsContainer />
      </TimelineHeader>
    );

    return (
      <StatusTimelineContainer
        timelineId='community'
        loadMore={this.handleLoadMore}
        header={header}
        emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
      />
    );
  }

};
