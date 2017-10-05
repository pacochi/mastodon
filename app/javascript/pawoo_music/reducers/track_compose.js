import {
  TRACK_COMPOSE_BASIC_TAB_FOCUS,
  TRACK_COMPOSE_VIDEO_TAB_FOCUS,
  TRACK_COMPOSE_TRACK_TITLE_CHANGE,
  TRACK_COMPOSE_TRACK_ARTIST_CHANGE,
  TRACK_COMPOSE_TRACK_TEXT_CHANGE,
  TRACK_COMPOSE_TRACK_VISIBILITY_CHANGE,
  TRACK_COMPOSE_TRACK_MUSIC_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE,
  TRACK_COMPOSE_SUBMIT_REQUEST,
  TRACK_COMPOSE_SUBMIT_SUCCESS,
  TRACK_COMPOSE_SUBMIT_FAIL,
} from '../actions/track_compose';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  is_submitting: false,
  tab: 'basic',
  track: {
    music: null,
    title: '',
    artist: '',
    text: '',
    visibility: 'public',
    video: {
      image: null,
      blur: {
        visible: false,
        params: {
          movement: { band: { bottom: 50, top: 300 } },
          blink: { band: { bottom: 2000, top: 15000 } },
        },
      },
      particle: {
        visible: false,
        params: { color: 0xffffff, limit: { band: { bottom: 300, top: 2000 } } },
      },
      spectrum: { visible: true, params: { mode: 2, color: 0xffffff } },
    },
  },
});

export default function track_compose(state = initialState, action) {
  switch(action.type) {
  case TRACK_COMPOSE_BASIC_TAB_FOCUS:
    return state.set('tab', 'basic');
  case TRACK_COMPOSE_VIDEO_TAB_FOCUS:
    return state.set('tab', 'video');
  case TRACK_COMPOSE_TRACK_TITLE_CHANGE:
    return state.setIn(['track', 'title'], action.value);
  case TRACK_COMPOSE_TRACK_ARTIST_CHANGE:
    return state.setIn(['track', 'artist'], action.value);
  case TRACK_COMPOSE_TRACK_TEXT_CHANGE:
    return state.setIn(['track', 'text'], action.value);
  case TRACK_COMPOSE_TRACK_VISIBILITY_CHANGE:
    return state.setIn(['track', 'visibility'], action.value);
  case TRACK_COMPOSE_TRACK_MUSIC_CHANGE:
    return state.setIn(['track', 'music'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE:
    return state.setIn(['track', 'video', 'image'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE:
    return state.setIn(['track', 'video', 'blur', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE:
    return state.setIn(['track', 'video', 'blur', 'params', 'movement', 'threshold'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE:
    return state.setIn(['track', 'video', 'blur', 'params', 'blink', 'threshold'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'params', 'color'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'params', 'limit', 'threshold'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'params', 'mode'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'params', 'color'], action.value);
  case TRACK_COMPOSE_SUBMIT_REQUEST:
    return state.set('is_submitting', true);
  case TRACK_COMPOSE_SUBMIT_SUCCESS:
    return initialState;
  case TRACK_COMPOSE_SUBMIT_FAIL:
    return state.set('is_submitting', false);
  default:
    return state;
  }
}
