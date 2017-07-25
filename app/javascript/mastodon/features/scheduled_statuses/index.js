import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import { fetchScheduledStatuses, expandScheduledStatuses } from '../../actions/schedules';
import StatusList from '../../components/status_list';
import Compose from '../../features/compose';
import ImmutablePureComponent from 'react-immutable-pure-component';

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'schedules', 'items']),
  loaded: state.getIn(['status_lists', 'schedules', 'loaded']),
});

@connect(mapStateToProps)
export default class ScheduledStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    loaded: PropTypes.bool,
  };

  componentWillMount () {
    this.props.dispatch(fetchScheduledStatuses());
  }

  handleScrollToBottom = () => {
    this.props.dispatch(expandScheduledStatuses());
  }

  render () {
    const { loaded } = this.props;

    return (
      <div className='scheduled_statuses__container'>
        {
          loaded ?
            (<StatusList {...this.props} scrollKey='scheduledStatuses' standalone={false} absoluteTimestamp onScrollToBottom={this.handleScrollToBottom} />) :
            (<LoadingIndicator />)
        }
        <Compose schedule />
      </div>
    );
  }

}
