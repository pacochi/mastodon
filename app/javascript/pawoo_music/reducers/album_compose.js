import Immutable from 'immutable';
import { ACCOUNT_TRACKS_REFRESH_SUCCESSS } from '../actions/account_tracks';
import {
  ALBUM_COMPOSE_REGISTER,
  ALBUM_COMPOSE_REGISTERED_TRACKS_REARRANGE,
  ALBUM_COMPOSE_UNREGISTER,
  ALBUM_COMPOSE_UNREGISTERED_TRACKS_REARRANGE,
} from '../actions/album_compose';

const initialState = Immutable.fromJS({
  registeredTracks: [],
  unregisteredTracks: [],
});

export default function album_compose(state = initialState, action) {
  switch (action) {
  case ACCOUNT_TRACKS_REFRESH_SUCCESSS:
    // TODO: check account
    return state.merge([
      [
        'registeredTracks',
        state.get('registeredTracks').filter(
          id => action.tracks.find(
            track => track.id === id
          )
        ),
      ], [
        'unregisteredTracks',
        state.get('unregisteredTracks').withMutations(
          mutable => action.tracks.forEach(
            (_, id) => !mutable.includes(id) &&
                         !state.get('registeredTracks').registeredTracks.includes(id) &&
                         mutable.push(id)
          )
        ),
      ],
    ]);
  case ALBUM_COMPOSE_REGISTER:
    return state.merge([
      [
        'registeredTracks',
        state.get('registeredTracks')
             .insert(action.destination, state.getIn(['unregisteredTracks', action.source])),
      ], [
        'unregisteredTracks',
        state.get('unregisteredTracks').delete(action.source),
      ],
    ]);
  case ALBUM_COMPOSE_REGISTERED_TRACKS_REARRANGE:
    return state.update('registeredTracks',
      tracks => tracks.delete(action.source)
                     .insert(action.destination, tracks.get(action.source))
    );
  case ALBUM_COMPOSE_UNREGISTER:
    return state.merge([
      [
        'registeredTracks',
        state.get('registeredTracks')
             .insert(action.destination, state.getIn(['unregisteredTracks', action.source])),
      ], [
        'unregisteredTracks',
        state.get('unregisteredTracks').delete(action.source),
      ],
    ]);
  case ALBUM_COMPOSE_UNREGISTERED_TRACKS_REARRANGE:
    return state.update('unregisteredTracks',
      tracks => tracks.delete(action.source)
                     .insert(action.destination, tracks.get(action.source))
    );
  default:
    return state;
  }
}
