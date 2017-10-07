import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import { fetchFavouritedStatuses, expandFavouritedStatuses } from '../../../mastodon/actions/favourites';
import Timeline from '../../components/timeline';
import StatusList from '../../components/status_list';

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
    this.props.dispatch(fetchFavouritedStatuses());
  }

  handleScrollToBottom = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses());
  }, 300, { leading: true });

  render () {
    const { statusIds } = this.props;

    const Garally = (
      <div className='garally'>
        <StatusList
          scrollKey='favourited_garally'
          statusIds={statusIds}
          isGarally
          onScrollToBottom={this.handleScrollToBottom}
        />
      </div>
    );

    return (
      <Timeline garally={Garally}>
        <StatusList scrollKey='favourited_statuses' statusIds={statusIds} onScrollToBottom={this.handleScrollToBottom} />
      </Timeline>
    );
  }

}
