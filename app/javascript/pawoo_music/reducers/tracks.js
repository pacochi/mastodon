import {
  TRACKS_PLAY,
  TRACKS_STOP,
} from '../actions/tracks';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  trackId: null,
});

export default function tracks(state = initialState, action) {
  switch(action.type) {
  case TRACKS_PLAY:
    return state.set('trackId', action.value);
  case TRACKS_STOP:
    return state.set('trackId', null);
  default:
    return state;
  }
}
