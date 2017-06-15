import {
  TIMELINE_REFRESH_REQUEST,
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_REFRESH_FAIL,
  TIMELINE_UPDATE,
  TIMELINE_DELETE,
  TIMELINE_EXPAND_SUCCESS,
  TIMELINE_EXPAND_REQUEST,
  TIMELINE_EXPAND_FAIL,
  TIMELINE_SCROLL_TOP,
  TIMELINE_CONNECT,
  TIMELINE_DISCONNECT,
} from '../actions/timelines';
import {
  REBLOG_SUCCESS,
  UNREBLOG_SUCCESS,
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
} from '../actions/interactions';
import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_PINNED_STATUSES_FETCH_SUCCESS,
  ACCOUNT_PINNED_STATUSES_EXPAND_SUCCESS,
} from '../actions/accounts';
<<<<<<< HEAD
import {
  STATUS_SEARCH_TIMELINE_FETCH_REQUEST,
  STATUS_SEARCH_TIMELINE_FETCH_SUCCESS,
  STATUS_SEARCH_TIMELINE_FETCH_FAIL,
  STATUS_SEARCH_TIMELINE_EXPAND_REQUEST,
  STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS,
  STATUS_SEARCH_TIMELINE_EXPAND_FAIL,
} from '../actions/search';
import {
  STATUS_PIN_SUCCESS,
  STATUS_UNPIN_SUCCESS,
  CONTEXT_FETCH_SUCCESS,
} from '../actions/statuses';
=======
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
import Immutable from 'immutable';

const initialState = Immutable.Map();

<<<<<<< HEAD
  media: Immutable.Map({
    path: () => '/api/v1/timelines/public',
    next: null,
    params: { local: true, media: true },
    isLoading: false,
    online: false,
    loaded: false,
    top: true,
    unread: 0,
    items: Immutable.List(),
  }),

  tag: Immutable.Map({
    path: (id) => `/api/v1/timelines/tag/${id}`,
    next: null,
    isLoading: false,
    id: null,
    loaded: false,
    top: true,
    unread: 0,
    items: Immutable.List(),
  }),

  accounts_timelines: Immutable.Map(),
  status_search_timelines: Immutable.Map(),
  accounts_media_timelines: Immutable.Map(),
  ancestors: Immutable.Map(),
  descendants: Immutable.Map(),
  accounts_pinned_statuses: Immutable.Map(),
=======
const initialTimeline = Immutable.Map({
  unread: 0,
  online: false,
  top: true,
  loaded: false,
  isLoading: false,
  next: false,
  items: Immutable.List(),
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
});

const normalizeTimeline = (state, timeline, statuses, next) => {
  const ids       = Immutable.List(statuses.map(status => status.get('id')));
  const wasLoaded = state.getIn([timeline, 'loaded']);
  const hadNext   = state.getIn([timeline, 'next']);
  const oldIds    = state.getIn([timeline, 'items'], Immutable.List());

  return state.update(timeline, initialTimeline, map => map.withMutations(mMap => {
    mMap.set('loaded', true);
    mMap.set('isLoading', false);
    if (!hadNext) mMap.set('next', next);
    mMap.set('items', wasLoaded ? ids.concat(oldIds) : ids);
  }));
};

const appendNormalizedTimeline = (state, timeline, statuses, next) => {
  const ids    = Immutable.List(statuses.map(status => status.get('id')));
  const oldIds = state.getIn([timeline, 'items'], Immutable.List());

  return state.update(timeline, initialTimeline, map => map.withMutations(mMap => {
    mMap.set('isLoading', false);
    mMap.set('next', next);
    mMap.set('items', oldIds.concat(ids));
  }));
};

const appendNormalizedStatusSearchTimeline = (state, keyword, statuses, hasMore, page) => {
  let moreIds = Immutable.List([]);

  statuses.forEach((status, i) => {
    state   = normalizeStatus(state, status);
    moreIds = moreIds.set(i, status.get('id'));
  });

  return state.updateIn(['status_search_timelines', keyword], Immutable.Map(), map => map
    .set('isLoading', false)
    .set('page', page)
    .set('hasMore', hasMore)
    .update('items', list => list.push(...moreIds)));
};

const normalizeStatusSearchTimeline = (state, keyword, statuses, hasMore=true, hitsTotal=0, page=1) => {
  let ids = Immutable.List();

  statuses.forEach((status, i) => {
    state = normalizeStatus(state, status);
    ids   = ids.set(i, status.get('id'));
  });

  return state.updateIn(['status_search_timelines', keyword], Immutable.Map(), map => map
    .set('isLoading', false)
    .set('loaded', true)
    .set('page', page)
    .set('hitsTotal', hitsTotal)
    .set('hasMore', hasMore)
    .update('items', Immutable.List(), list => ids ));
};


const updateTimeline = (state, timeline, status, references) => {
  const top        = state.getIn([timeline, 'top']);
  const ids        = state.getIn([timeline, 'items'], Immutable.List());
  const includesId = ids.includes(status.get('id'));
  const unread     = state.getIn([timeline, 'unread'], 0);

  if (includesId) {
    return state;
  }

  let newIds = ids;

  return state.update(timeline, initialTimeline, map => map.withMutations(mMap => {
    if (!top) mMap.set('unread', unread + 1);
    if (top && ids.size > 40) newIds = newIds.take(20);
    if (status.getIn(['reblog', 'id'], null) !== null) newIds = newIds.filterNot(item => references.includes(item));
    mMap.set('items', newIds.unshift(status.get('id')));
  }));
};

const deleteStatus = (state, id, accountId, references, reblogOf) => {
<<<<<<< HEAD
  if (reblogOf) {
    // If we are deleting a reblog, just replace reblog with its original
    return state.updateIn(['home', 'items'], list => list.map(item => item === id ? reblogOf : item));
  }

  // Remove references from timelines
  ['home', 'media', 'public', 'community', 'tag'].forEach(function (timeline) {
    state = state.updateIn([timeline, 'items'], list => list.filterNot(item => item === id));
=======
  state.keySeq().forEach(timeline => {
    state = state.updateIn([timeline, 'items'], list => {
      if (reblogOf && !list.includes(reblogOf)) {
        return list.map(item => item === id ? reblogOf : item);
      } else {
        return list.filterNot(item => item === id);
      }
    });
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
  });

  // Remove reblogs of deleted status
  references.forEach(ref => {
    state = deleteStatus(state, ref[0], ref[1], []);
  });

  return state;
};

const filterTimelines = (state, relationship, statuses) => {
  let references;

  statuses.forEach(status => {
    if (status.get('account') !== relationship.id) {
      return;
    }

    references = statuses.filter(item => item.get('reblog') === status.get('id')).map(item => [item.get('id'), item.get('account')]);
    state      = deleteStatus(state, status.get('id'), status.get('account'), references);
  });

  return state;
};

const updateTop = (state, timeline, top) => {
  return state.update(timeline, initialTimeline, map => map.withMutations(mMap => {
    if (top) mMap.set('unread', 0);
    mMap.set('top', top);
  }));
};

const normalizeAccountPinnedStatuses = (state, accountId, statuses, next) => {
  let ids = Immutable.List();

  statuses.forEach((status, i) => {
    ids = ids.set(i, status.id);
  });

  return state.updateIn(['accounts_pinned_statuses', accountId], Immutable.Map(), map => map
    .set('isLoading', false)
    .set('loaded', true)
    .set('next', next)
    .update('items', Immutable.List(), list => list.concat(ids)));
};

export default function timelines(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_REFRESH_REQUEST:
  case TIMELINE_EXPAND_REQUEST:
    return state.update(action.timeline, initialTimeline, map => map.set('isLoading', true));
  case TIMELINE_REFRESH_FAIL:
  case TIMELINE_EXPAND_FAIL:
    return state.update(action.timeline, initialTimeline, map => map.set('isLoading', false));
  case TIMELINE_REFRESH_SUCCESS:
    return normalizeTimeline(state, action.timeline, Immutable.fromJS(action.statuses), action.next);
  case TIMELINE_EXPAND_SUCCESS:
    return appendNormalizedTimeline(state, action.timeline, Immutable.fromJS(action.statuses), action.next);
  case TIMELINE_UPDATE:
    return updateTimeline(state, action.timeline, Immutable.fromJS(action.status), action.references);
  case TIMELINE_DELETE:
    return deleteStatus(state, action.id, action.accountId, action.references, action.reblogOf);
<<<<<<< HEAD
  case CONTEXT_FETCH_SUCCESS:
    return normalizeContext(state, action.id, Immutable.fromJS(action.ancestors), Immutable.fromJS(action.descendants));
  case ACCOUNT_TIMELINE_FETCH_REQUEST:
  case ACCOUNT_TIMELINE_EXPAND_REQUEST:
    return state.updateIn(['accounts_timelines', action.id], Immutable.Map(), map => map.set('isLoading', true));
  case ACCOUNT_TIMELINE_FETCH_FAIL:
  case ACCOUNT_TIMELINE_EXPAND_FAIL:
    return state.updateIn(['accounts_timelines', action.id], Immutable.Map(), map => map.set('isLoading', false));
  case ACCOUNT_TIMELINE_FETCH_SUCCESS:
    return normalizeAccountTimeline(state, action.id, Immutable.fromJS(action.statuses), action.replace, action.next);
  case ACCOUNT_TIMELINE_EXPAND_SUCCESS:
    return appendNormalizedAccountTimeline(state, action.id, Immutable.fromJS(action.statuses), action.next);
  case ACCOUNT_MEDIA_TIMELINE_FETCH_REQUEST:
  case ACCOUNT_MEDIA_TIMELINE_EXPAND_REQUEST:
    return state.updateIn(['accounts_media_timelines', action.id], Immutable.Map(), map => map.set('isLoading', true));
  case ACCOUNT_MEDIA_TIMELINE_FETCH_FAIL:
  case ACCOUNT_MEDIA_TIMELINE_EXPAND_FAIL:
    return state.updateIn(['accounts_media_timelines', action.id], Immutable.Map(), map => map.set('isLoading', false));
  case ACCOUNT_MEDIA_TIMELINE_FETCH_SUCCESS:
    return normalizeAccountMediaTimeline(state, action.id, Immutable.fromJS(action.statuses), action.replace, action.next);
  case ACCOUNT_MEDIA_TIMELINE_EXPAND_SUCCESS:
    return appendNormalizedAccountMediaTimeline(state, action.id, Immutable.fromJS(action.statuses), action.next);
  case STATUS_SEARCH_TIMELINE_FETCH_REQUEST:
  case STATUS_SEARCH_TIMELINE_EXPAND_REQUEST:
    return state.updateIn(['status_search_timelines', action.keyword], Immutable.Map(), map => map.set('isLoading', true));
  case STATUS_SEARCH_TIMELINE_FETCH_FAIL:
  case STATUS_SEARCH_TIMELINE_EXPAND_FAIL:
    return state.updateIn(['status_search_timelines', action.keyword], Immutable.Map(), map => map.set('isLoading', false));
  case STATUS_SEARCH_TIMELINE_FETCH_SUCCESS:
    return normalizeStatusSearchTimeline(state, action.keyword, Immutable.fromJS(action.statuses), action.hasMore, action.hitsTotal, action.page+1);
  case STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS:
    return appendNormalizedStatusSearchTimeline(state, action.keyword, Immutable.fromJS(action.statuses), action.hasMore, action.page+1);
=======
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
  case ACCOUNT_BLOCK_SUCCESS:
  case ACCOUNT_MUTE_SUCCESS:
    return filterTimelines(state, action.relationship, action.statuses);
  case TIMELINE_SCROLL_TOP:
    return updateTop(state, action.timeline, action.top);
  case TIMELINE_CONNECT:
    return state.update(action.timeline, initialTimeline, map => map.set('online', true));
  case TIMELINE_DISCONNECT:
<<<<<<< HEAD
    return state.setIn([action.timeline, 'online'], false);
  case ACCOUNT_PINNED_STATUSES_FETCH_SUCCESS:
  case ACCOUNT_PINNED_STATUSES_EXPAND_SUCCESS:
    return normalizeAccountPinnedStatuses(state, action.id, action.statuses, action.next);
  case STATUS_PIN_SUCCESS:
    return state.updateIn(['accounts_pinned_statuses', action.accountId], Immutable.Map(), map => map
      .update('items', Immutable.List(), list => list.unshift(action.id).toOrderedSet().toList()));
  case STATUS_UNPIN_SUCCESS:
    return state.updateIn(['accounts_pinned_statuses', action.accountId], Immutable.Map(), map => map
      .update('items', Immutable.List(), list => list.filter((id) => id !== action.id)));
=======
    return state.update(action.timeline, initialTimeline, map => map.set('online', false));
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
  default:
    return state;
  }
};
