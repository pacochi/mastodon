import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { refreshPublicTimeline, expandPublicTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import { connectPublicStream } from '../../actions/streaming';
import TimelineHeader from '../../components/timeline_header';
import ColumnSettingsContainer from '../../../mastodon/features/public_timeline/containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Federated timeline' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'public', 'unread']) > 0,
});

@injectIntl
@connect(mapStateToProps)
export default class PublicTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(refreshPublicTimeline());
    this.disconnect = dispatch(connectPublicStream());
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = () => {
    this.props.dispatch(expandPublicTimeline());
  }

  render () {
    const { intl, hasUnread } = this.props;

    const header = (
      <TimelineHeader
        icon='globe'
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
      >
        <ColumnSettingsContainer />
      </TimelineHeader>
    );

    return (
      <StatusTimelineContainer
        timelineId='public'
        loadMore={this.handleLoadMore}
        header={header}
        emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other instances to fill it up' />}
        withComposeForm
      />
    );
  }

};
