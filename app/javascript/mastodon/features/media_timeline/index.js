import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import {
  refreshMediaTimeline,
  expandMediaTimeline,
  updateTimeline,
  deleteFromTimelines,
  connectTimeline,
  disconnectTimeline,
} from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import ColumnSettingsContainer from '../public_timeline/containers/column_settings_container';
import createStream from '../../stream';

const messages = defineMessages({
  title: { id: 'column.media', defaultMessage: 'Media timeline' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'media', 'unread']) > 0,
  streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url']),
  accessToken: state.getIn(['meta', 'access_token']),
});

let subscription;

class MediaTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    hasUnread: PropTypes.bool,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('MEDIA', {}));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch, streamingAPIBaseURL, accessToken } = this.props;

    dispatch(refreshMediaTimeline());

    if (typeof this._subscription !== 'undefined') {
      return;
    }

    this._subscription = createStream(streamingAPIBaseURL, accessToken, 'public:local', {

      connected () {
        dispatch(connectTimeline('media'));
      },

      reconnected () {
        dispatch(connectTimeline('media'));
      },

      disconnected () {
        dispatch(disconnectTimeline('media'));
      },

      received (data) {
        switch(data.event) {
        case 'update':
          const status = JSON.parse(data.payload);
          if (0 < status.media_attachments.length) {
            dispatch(updateTimeline('media', status));
          }
          break;
        case 'delete':
          dispatch(deleteFromTimelines(data.payload));
          break;
        }
      },

    });
  }

  componentWillUnmount () {
    if (typeof this._subscription !== 'undefined') {
      this._subscription.close();
      this._subscription = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = () => {
    this.props.dispatch(expandMediaTimeline());
  }

  render () {
    const { intl, columnId, hasUnread, multiColumn } = this.props;
    const pinned = !!columnId;

    return (
      <Column ref={this.setRef}>
        <ColumnHeader
          icon='image'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer />
        </ColumnHeader>

        <StatusListContainer
          timelineId='media'
          loadMore={this.handleLoadMore}
          trackScroll={!pinned}
          scrollKey={`media_timeline-${columnId}`}
          emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other instances to fill it up' />}
          squareMedia
        />
      </Column>
    );
  }

};

export default connect(mapStateToProps)(injectIntl(MediaTimeline));
