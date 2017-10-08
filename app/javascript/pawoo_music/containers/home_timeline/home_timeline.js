import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Link from '../../components/link_wrapper';
import { changeSetting } from '../../../mastodon/actions/settings';
import { expandHomeTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import MediaPostButton from '../../components/media_post_button';

const mapStateToProps = state => ({
  hasFollows: state.getIn(['accounts_counters', state.getIn(['meta', 'me']), 'following_count']) > 0,
});

@connect(mapStateToProps)
export default class HomeTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasFollows: PropTypes.bool.isRequired,
  };

  handleLoadMore = () => {
    this.props.dispatch(expandHomeTimeline());
  }

  handleChange = (key, value) => {
    this.props.dispatch(changeSetting(['home', ...key], value));
  }

  render () {
    const { hasFollows } = this.props;

    const emptyMessage = hasFollows ? (
      <FormattedMessage id='empty_column.home.inactivity' defaultMessage='Your home feed is empty. If you have been inactive for a while, it will be regenerated for you soon.' />
    ) : (
      <FormattedMessage
        id='empty_column.home'
        defaultMessage="You aren't following anyone yet. Visit {public} or use search to get started and meet other users."
        values={{ public: <Link to='/timelines/public'><FormattedMessage id='empty_column.home.public_timeline' defaultMessage='the public timeline' /></Link> }}
      />
    );

    return (
      <StatusTimelineContainer
        timelineId='home'
        loadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
        galleryPrepend={<MediaPostButton />}
        withComposeForm
      />
    );
  }

};
