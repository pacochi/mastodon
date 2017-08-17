import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { refreshHashtagTimeline, expandHashtagTimeline } from '../../../mastodon/actions/timelines';
import { addColumn, removeColumn } from '../../../mastodon/actions/columns';
import StatusTimelineContainer from '../../containers/status_timeline';
import { connectHashtagStream } from '../../actions/streaming';
import TimelineHeader from '../../components/timeline_header';

const mapStateToProps = (state, props) => {
  const params = props.match.params;
  return {
    params,
    hasUnread: state.getIn(['timelines', `hashtag:${params.id}`, 'unread']) > 0,
    column: state.getIn(['settings', 'columns']).find((column) => column.get('id') === 'HASHTAG' && column.getIn(['params', 'id']) === params.id),
  };
};

@connect(mapStateToProps)
export default class HashtagTimeline extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    column: ImmutablePropTypes.map,
    hasUnread: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    const { id } = this.props.params;

    dispatch(refreshHashtagTimeline(id));
    this._subscribe(dispatch, id);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.dispatch(refreshHashtagTimeline(nextProps.params.id));
      this._unsubscribe();
      this._subscribe(this.props.dispatch, nextProps.params.id);
    }
  }

  componentWillUnmount () {
    this._unsubscribe();
  }

  handleLoadMore = () => {
    this.props.dispatch(expandHashtagTimeline(this.props.params.id));
  }

  handlePin = () => {
    const { column, dispatch } = this.props;

    if (column) {
      dispatch(removeColumn(column.get('uuid')));
    } else {
      dispatch(addColumn('HASHTAG', { id: this.props.params.id }));
    }
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
    const { params: { id }, column, hasUnread } = this.props;

    const header = (
      <TimelineHeader
        icon='hashtag'
        active={hasUnread}
        title={id}
      >
        <button key='pin-button' className='text-btn pin-button' onClick={this.handlePin}>
          {column ? (
            <i className='fa fa-times' />
          ) : (
            <i className='fa fa-plus' />
          )}
          {column ? (
            <FormattedMessage id='column_header.unpin' defaultMessage='Unpin' />
          ) : (
            <FormattedMessage id='column_header.pin' defaultMessage='Pin' />
          )}
        </button>
      </TimelineHeader>

    );

    return (
      <StatusTimelineContainer
        timelineId={`hashtag:${id}`}
        loadMore={this.handleLoadMore}
        header={header}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
      />
    );
  }

};
