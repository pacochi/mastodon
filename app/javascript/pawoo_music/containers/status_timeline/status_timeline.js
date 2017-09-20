import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createSelector } from 'reselect';
import { debounce } from 'lodash';
import TimelineContainer from '../timeline';
import StatusList from '../../components/status_list';
import { scrollTopTimeline } from '../../../mastodon/actions/timelines';

const makeGetStatusIds = () => createSelector([
  (state, { type }) => state.getIn(['settings', type], Immutable.Map()),
  (state, { type }) => state.getIn(['timelines', type, 'items'], Immutable.List()),
  (state)           => state.get('statuses'),
  (state)           => state.getIn(['meta', 'me']),
], (columnSettings, statusIds, statuses, me) => {
  const showReblog = columnSettings.getIn(['shows', 'reblog']);
  const showReply =  columnSettings.getIn(['shows', 'reply']);
  const regexText =  columnSettings.getIn(['regex', 'body']);
  let regex = null;

  try {
    if (regexText) {
      const trimmedRegexText = regexText.trim();
      regex = trimmedRegexText ? new RegExp(trimmedRegexText, 'i') : null;
    }
  } catch(e) {
    // Bad regex, don't affect filters
  }

  return statusIds.filter(id => {
    const statusForId = statuses.get(id);
    let showStatus    = true;

    if (showReblog === false) {
      showStatus = showStatus && statusForId.get('reblog') === null;
    }

    if (showReply === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me);
    }

    if (regex && showStatus) {
      showStatus = !regex.test(statusForId.get('reblog') ? statuses.getIn([statusForId.get('reblog'), 'search_index']) : statusForId.get('search_index'));
    }

    return showStatus;
  });
});

const makeMapStateToProps = () => {
  const getStatusIds = makeGetStatusIds();

  const mapStateToProps = (state, { timelineId }) => ({
    statusIds: getStatusIds(state, { type: timelineId }),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    hasMore: !!state.getIn(['timelines', timelineId, 'next']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { timelineId, loadMore }) => ({

  onScrollToBottom: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, false));
    loadMore();
  }, 300, { leading: true }),

  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, true));
  }, 100),

  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, false));
  }, 100),

});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class StatusTimeline extends ImmutablePureComponent {

  static propTypes = {
    timelineId: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
    withComposeForm: PropTypes.bool,
  }

  static defaultProps = {
    withComposeForm: true,
  }

  render () {
    const { timelineId, withComposeForm, ...other } = this.props;

    const Garally = (
      <div>
        Garally
      </div>
    );

    return (
      <TimelineContainer garally={Garally} withComposeForm={withComposeForm}>
        <StatusList scrollKey={`${timelineId}_timeline`} {...other} />
      </TimelineContainer>
    );
  }

}
