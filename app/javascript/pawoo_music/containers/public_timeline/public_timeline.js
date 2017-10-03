import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { refreshPublicTimeline, expandPublicTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import { connectPublicStream } from '../../actions/streaming';

@connect()
export default class PublicTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    return (
      <StatusTimelineContainer
        timelineId='public'
        loadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other instances to fill it up' />}
        withComposeForm
      />
    );
  }

};
