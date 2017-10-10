import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { refreshHashtagTimeline, expandHashtagTimeline } from '../../../mastodon/actions/timelines';
import StatusTimelineContainer from '../../containers/status_timeline';
import { connectHashtagStream } from '../../actions/streaming';
import { updateTimelineTitle } from '../../actions/timeline';
import { changeFooterType } from '../../actions/footer';

const mapStateToProps = (state, props) => ({
  hashtag: props.match.params.id,
  title: state.getIn(['pawoo_music', 'timeline', 'title']),
});

@connect(mapStateToProps)
export default class HashtagTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hashtag: PropTypes.string.isRequired,
  };

  componentDidMount () {
    const { dispatch, hashtag } = this.props;

    dispatch(refreshHashtagTimeline(hashtag));
    dispatch(refreshHashtagTimeline(hashtag, { onlyMusics: true }));
    dispatch(updateTimelineTitle(`#${hashtag} タイムライン`)); /* TODO: intl */
    dispatch(changeFooterType('lobby_gallery'));
    this._subscribe(dispatch, hashtag);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.hashtag !== this.props.hashtag) {
      const { dispatch, hashtag } = nextProps;
      dispatch(refreshHashtagTimeline(hashtag));
      dispatch(refreshHashtagTimeline(hashtag, { onlyMusics: true }));
      dispatch(updateTimelineTitle(`#${hashtag} タイムライン`)); /* TODO: intl */
      this._unsubscribe();
      this._subscribe(this.props.dispatch, nextProps.hashtag);
    }
  }

  componentWillUnmount () {
    this._unsubscribe();
  }

  handleLoadMore = (options) => {
    this.props.dispatch(expandHashtagTimeline(this.props.hashtag, options));
  }

  _subscribe (dispatch, id) {
    this.disconnect = dispatch(connectHashtagStream(id));
  }

  _unsubscribe () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  render () {
    const { hashtag } = this.props;

    return (
      <StatusTimelineContainer
        timelineId={`hashtag:${hashtag}`}
        loadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        withComposeForm
      />
    );
  }

};
