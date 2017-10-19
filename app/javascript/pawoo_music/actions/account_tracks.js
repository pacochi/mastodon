import api from '../../mastodon/api';

export const ACCOUNT_TRACKS_REFRESH_REQUEST = 'ACCOUNT_TRACKS_REFRESH_REQUEST';
export const ACCOUNT_TRACKS_REFRESH_SUCCESSS = 'ACCOUNT_TRACKS_REFRESH_SUCCESSS';
export const ACCOUNT_TRACKS_REFRESH_FAIL = 'ACCOUNT_TRACKS_REFRESH_FAIL';

export function refreshAccountTracks(accountId) {
  return function (dispatch, getState) {
    if (getState().getIn(['pawoo_music', 'account_tracks', accountId, 'isLoading'])) {
      return;
    }

    dispatch(refreshAccountTracksRequest(accountId));
    api(getState).get(`/api/v1/accounts/${accountId}/tracks`).then(({ data }) => {
      dispatch(refreshAccountTracksSuccess(accountId, data));
    }).catch(error => {
      dispatch(refreshAccountTracksFail(accountId, error));
    });
  };
}

export function refreshAccountTracksRequest(account) {
  return {
    type: ACCOUNT_TRACKS_REFRESH_REQUEST,
    account,
  };
}

export function refreshAccountTracksSuccess(account, tracks) {
  return {
    type: ACCOUNT_TRACKS_REFRESH_SUCCESSS,
    account,
    tracks,
  };
}

export function refreshAccountTracksFail(account, error) {
  return {
    type: ACCOUNT_TRACKS_REFRESH_FAIL,
    account,
    error,
  };
}
