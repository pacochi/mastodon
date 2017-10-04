import {
  ACCOUNT_TRACKS_REFRESH_REQUEST,
  ACCOUNT_TRACKS_REFRESH_SUCCESSS,
  ACCOUNT_TRACKS_REFRESH_FAIL,
} from '../actions/account_tracks';
import Immutable from 'immutable';

const initialState = Immutable.Map();

const initialAccountTracks = Immutable.Map({
  isLoading: false,
  tracks: Immutable.Map(),
});

export default function tracks(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_TRACKS_REFRESH_REQUEST:
    return state.update(action.account, initialAccountTracks, map => map.set('isLoading', true));
  case ACCOUNT_TRACKS_REFRESH_SUCCESSS:
    return state.update(action.account, initialAccountTracks, map => map.merge([
      [
        'isLoading',
        false,
      ], [
        'tracks',
        map.get('tracks').withMutations(
          mutable => action.tracks.forEach(
            track => mutable.set(track.id, Immutable.fromJS(track)))),
      ],
    ]));
  case ACCOUNT_TRACKS_REFRESH_FAIL:
    return state.update(action.account, initialAccountTracks, map => map.set('isLoading', false));
  default:
    return state;
  }
}
