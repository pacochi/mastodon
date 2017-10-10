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
});

@connect(mapStateToProps)
export default class FavouritedStatus extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(updateTimelineTitle('お気に入り')); /* TODO: intl */
    dispatch(changeFooterType('lobby_gallery'));
    dispatch(fetchFavouritedStatuses());
  }

  handleScrollToBottom = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses());
  }, 300, { leading: true });

  render () {
    const { statusIds } = this.props;

    const gallery = (
      <StatusList
        scrollKey='favourited_gallery'
        statusIds={statusIds}
        isGallery
        onScrollToBottom={this.handleScrollToBottom}
      />
    );

    return (
      <Timeline gallery={gallery}>
        <StatusList scrollKey='favourited_statuses' statusIds={statusIds} onScrollToBottom={this.handleScrollToBottom} />
      </Timeline>
    );
  }

}
