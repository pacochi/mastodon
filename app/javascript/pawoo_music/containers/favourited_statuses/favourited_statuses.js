import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import { fetchFavouritedStatuses, expandFavouritedStatuses } from '../../../mastodon/actions/favourites';
import Timeline from '../../components/timeline';
import StatusList from '../../components/status_list';
import { updateTimelineTitle } from '../../actions/timeline';
import { changeFooterType } from '../../actions/footer';

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'favourites', 'items']),
  galleryStatusIds: state.getIn(['status_lists', 'favourites:music', 'items']),
  hasMore: !!state.getIn(['status_lists', 'favourites', 'next']),
  galleryHasMore: !!state.getIn(['status_lists', 'favourites:music', 'next']),
});

@connect(mapStateToProps)
export default class FavouritedStatus extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    galleryStatusIds: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool,
    galleryHasMore: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(updateTimelineTitle('お気に入り')); /* TODO: intl */
    dispatch(changeFooterType('lobby_gallery'));
    dispatch(fetchFavouritedStatuses());
    dispatch(fetchFavouritedStatuses({ onlyMusics: true }));
  }

  handleScrollToBottom = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses());
  }, 300, { leading: true });

  handleGalleryScrollToBottom = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses({ onlyMusics: true }));
  }, 300, { leading: true });

  render () {
    const { statusIds, galleryStatusIds, hasMore, galleryHasMore } = this.props;

    const gallery = (
      <StatusList
        scrollKey='favourited_gallery'
        statusIds={galleryStatusIds}
        hasMore={galleryHasMore}
        isGallery
        onScrollToBottom={this.handleGalleryScrollToBottom}
      />
    );

    return (
      <Timeline gallery={gallery}>
        <StatusList scrollKey='favourited_statuses' statusIds={statusIds} onScrollToBottom={this.handleScrollToBottom} hasMore={hasMore} />
      </Timeline>
    );
  }

}
