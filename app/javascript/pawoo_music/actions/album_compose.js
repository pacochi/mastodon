export const ALBUM_COMPOSE_REGISTER = 'ALBUM_COMPOSE_REGISTER';
export const ALBUM_COMPOSE_REGISTERED_TRACKS_REARRANGE = 'ALBUM_COMPOSE_REGISTERED_TRACKS_REARRANGE';
export const ALBUM_COMPOSE_UNREGISTER = 'ALBUM_COMPOSE_UNREGISTER';
export const ALBUM_COMPOSE_UNREGISTERED_TRACKS_REARRANGE = 'ALBUM_COMPOSE_UNREGISTERED_TRACKS_REARRANGE';

export function register(source, destination) {
  return {
    type: 'ALBUM_COMPOSE_REGISTER',
    source,
    destination,
  };
}

export function rearrangeRegisteredTracks(source, destination) {
  return {
    type: 'ALBUM_COMPOSE_REGISTERED_TRACKS_REARRANGE',
    source,
    destination,
  };
}

export function unregister(source, destination) {
  return {
    type: 'ALBUM_COMPOSE_UNREGISTER',
    source,
    destination,
  };
}

export function rearrangeUnregisteredTracks(source, destination) {
  return {
    type: 'ALBUM_COMPOSE_UNREGISTERED_TRACKS_REARRANGE',
    source,
    destination,
  };
}
