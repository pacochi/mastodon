import api from '../../../api';
import { miscFail } from '../../../actions/miscerrors';
export const MUSIC_SKIP_SUCCESS = 'MUSIC_SKIP_SUCCESS';
export const MUSIC_SKIP_FAIL    = 'MUSIC_SKIP_FAIL';

export function skipMusicItem(e, targetDeck, id) {
  return (dispatch, getState) => {
    api(getState).delete(`/api/v1/playlists/${targetDeck}/deck_queues/${id}`)
    .then((response)=>{
      return dispatch(skipMusicSuccess(id));
    })
    .catch((error)=>{
      dispatch(miscFail(e));
      return dispatch(skipMusicFail(id, error));
    });
  };
};

export function skipMusicSuccess(id) {
  return {
    type: MUSIC_SKIP_SUCCESS,
    id: id,
  };
};

export function skipMusicFail(id, error) {
  return {
    type: MUSIC_SKIP_FAIL,
    id: id,
    error: error,
  };
};
