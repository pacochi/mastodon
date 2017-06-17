import api from '../api';
import { miscFail } from './miscerrors';

export function skipMusicItem(targetDeck, id) {
  return (dispatch, getState) => {
    api(getState).delete(`/api/v1/playlists/${targetDeck}/deck_queues/${id}`)
    .then((response)=>{
    })
    .catch((error)=>{
      dispatch(miscFail(error));
    });
  };
};
