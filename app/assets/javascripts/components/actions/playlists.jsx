import api, { getLinks } from '../api'
import Immutable from 'immutable';

export const PLAYLIST_FETCH_REQUEST = 'PLAYLIST_FETCH_REQUEST';
export const PLAYLIST_FETCH_SUCCESS = 'PLAYLIST_FETCH_SUCCESS';
export const PLAYLIST_FETCH_FAIL    = 'PLAYLIST_FETCH_FAIL';

export const PLAYLIST_ADD_REQUEST = 'PLAYLIST_ADD_REQUEST';
export const PLAYLIST_ADD_SUCCESS = 'PLAYLIST_ADD_SUCCESS';
export const PLAYLIST_ADD_FAIL    = 'PLAYLIST_ADD_FAIL';

export const PLAYLIST_SKIP_REQUEST = 'PLAYLIST_SKIP_REQUEST';
export const PLAYLIST_SKIP_SUCCESS = 'PLAYLIST_SKIP_SUCCESS';
export const PLAYLIST_SKIP_FAIL    = 'PLAYLIST_SKIP_FAIL';

export function fetchPlaylist(id) {
  return (dispatch, getState) => {
    // dispatch(fetchRelationships([id]));
    //
    // if (getState().getIn(['accounts', id], null) !== null) {
    //   return;
    // }
    //
    // dispatch(fetchPlaylistRequest(id));
    //
    // api(getState).get(`/api/v1/accounts/${id}`).then(response => {
    //   dispatch(fetchPlaylistSuccess(response.data));
    // }).catch(error => {
    //   dispatch(fetchPlaylistFail(id, error));
    // });
  };
};

export function fetchPlaylistRequest(id) {
  return {
    type: PLAYLIST_FETCH_REQUEST,
    id
  };
};

export function fetchPlaylistSuccess(account) {
  return {
    type: PLAYLIST_FETCH_SUCCESS,
    account
  };
};

export function fetchPlaylistFail(id, error) {
  return {
    type: PLAYLIST_FETCH_FAIL,
    id,
    error,
    skipAlert: true
  };
};
