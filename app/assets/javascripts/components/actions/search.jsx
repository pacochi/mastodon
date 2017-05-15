import api from '../api'
import Immutable from 'immutable';

export const SEARCH_CHANGE = 'SEARCH_CHANGE';
export const SEARCH_CLEAR  = 'SEARCH_CLEAR';
export const SEARCH_SHOW   = 'SEARCH_SHOW';

export const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
export const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
export const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

export const STATUS_SEARCH_TIMELINE_FETCH_REQUEST = 'STATUS_SEARCH_TIMELINE_FETCH_REQUEST';
export const STATUS_SEARCH_TIMELINE_FETCH_SUCCESS = 'STATUS_SEARCH_TIMELINE_FETCH_SUCCESS';
export const STATUS_SEARCH_TIMELINE_FETCH_FAIL    = 'STATUS_SEARCH_TIMELINE_FETCH_FAIL';

export const STATUS_SEARCH_TIMELINE_EXPAND_REQUEST = 'STATUS_SEARCH_TIMELINE_EXPAND_REQUEST';
export const STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS = 'STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS';
export const STATUS_SEARCH_TIMELINE_EXPAND_FAIL    = 'STATUS_SEARCH_TIMELINE_EXPAND_FAIL';

export function changeSearch(value) {
  return {
    type: SEARCH_CHANGE,
    value
  };
};

export function clearSearch() {
  return {
    type: SEARCH_CLEAR
  };
};

export function submitSearch() {
  return (dispatch, getState) => {
    const value = getState().getIn(['search', 'value']);

    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest());

    api(getState).get('/api/v1/search', {
      params: {
        q: value,
        resolve: true
      }
    }).then(response => {
      dispatch(fetchSearchSuccess(response.data));
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };
};

export function fetchSearchRequest() {
  return {
    type: SEARCH_FETCH_REQUEST
  };
};

export function fetchSearchSuccess(results) {
  return {
    type: SEARCH_FETCH_SUCCESS,
    results,
    accounts: results.accounts,
    statuses: results.statuses
  };
};

export function fetchSearchFail(error) {
  return {
    type: SEARCH_FETCH_FAIL,
    error
  };
};

export function showSearch() {
  return {
    type: SEARCH_SHOW
  };
};

export function fetchStatusSearchTimeline(keyword, replace = false) {
  return (dispatch, getState) => {
    const ids      = getState().getIn(['timelines', 'status_search_timelines', keyword, 'items'], Immutable.List());
    const newestId = ids.size > 0 ? ids.first() : null;

    let params = '';
    let skipLoading = false;

    if (newestId !== null && !replace) {
      params      = `?since_id=${newestId}`;
      skipLoading = true;
    }

    dispatch(fetchStatusSearchTimelineRequest(keyword, skipLoading));

    api(getState).get(`/api/v1/search/statuses/${keyword}${params}`).then(response => {
      dispatch(fetchStatusSearchTimelineSuccess(keyword, response.data, replace, skipLoading));
    }).catch(error => {
      dispatch(fetchStatusSearchTimelineFail(keyword, error, skipLoading));
    });
  };
};

export function expandStatusSearchTimeline(keyword) {
  return (dispatch, getState) => {
    const lastId = getState().getIn(['timelines', 'status_search_timelines', keyword, 'items'], Immutable.List()).last();

    dispatch(expandStatusSearchTimelineRequest(keyword));

    api(getState).get(`/api/v1/search/statuses/${keyword}`, {
      params: {
        limit: 10,
        max_id: lastId
      }
    }).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(expandStatusSearchTimelineSuccess(keyword, response.data, next));
    }).catch(error => {
      dispatch(expandStatusSearchTimelineFail(keyword, error));
    });
  };
};

export function fetchStatusSearchTimelineRequest(keyword, skipLoading) {
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_REQUEST,
    keyword,
    skipLoading
  };
};

export function fetchStatusSearchTimelineSuccess(keyword, statuses, replace, skipLoading) {
  console.log(statuses);
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_SUCCESS,
    keyword,
    statuses,
    replace,
    skipLoading
  };
};

export function fetchStatusSearchTimelineFail(keyword, error, skipLoading) {
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_FAIL,
    keyword,
    error,
    skipLoading,
    skipAlert: error.response.status === 404
  };
};

export function expandStatusSearchTimelineRequest(keyword) {
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_REQUEST,
    keyword
  };
};

export function expandStatusSearchTimelineSuccess(keyword, statuses, next) {
  console.log(statuses);
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS,
    keyword,
    statuses,
    next
  };
};

export function expandStatusSearchTimelineFail(keyword, error) {
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_FAIL,
    keyword,
    error
  };
};
