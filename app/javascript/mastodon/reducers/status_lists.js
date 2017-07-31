import {
  FAVOURITED_STATUSES_FETCH_SUCCESS,
  FAVOURITED_STATUSES_EXPAND_SUCCESS,
} from '../actions/favourites';
import {
  SCHEDULED_STATUSES_FETCH_SUCCESS,
  SCHEDULED_STATUSES_EXPAND_SUCCESS,
  SCHEDULED_STATUSES_ADDITION,
} from '../actions/schedules';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  favourites: Immutable.Map({
    next: null,
    loaded: false,
    items: Immutable.List(),
  }),
  schedules: Immutable.Map({
    next: null,
    loaded: false,
    items: Immutable.List(),
  }),
});

const insertToDateSortedList = (state, listType, statuses, allStatuses) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('items', map.get('items')
                        .map(id => ({id, created_at: allStatuses.getIn([id, 'created_at'])}))
                        .concat(statuses)
                        .sort((i, j) => i.created_at < j.created_at ? -1 :
                                        (i.created_at > j.created_at ? 1 : 0))
                        .map(item => item.id));
  }));
};

const normalizeList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('loaded', true);
    map.set('items', Immutable.List(statuses.map(item => item.id)));
  }));
};

const appendToList = (state, listType, statuses, next) => {
  return state.update(listType, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('items', map.get('items').concat(statuses.map(item => item.id)));
  }));
};

export default function statusLists(state = initialState, action) {
  switch(action.type) {
  case FAVOURITED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'favourites', action.statuses, action.next);
  case FAVOURITED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'favourites', action.statuses, action.next);
  case SCHEDULED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'schedules', action.statuses, action.next);
  case SCHEDULED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'schedules', action.statuses, action.next);
  case SCHEDULED_STATUSES_ADDITION:
    return insertToDateSortedList(state, 'schedules', action.statuses, action.allStatuses);
  default:
    return state;
  }
};
