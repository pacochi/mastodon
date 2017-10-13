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
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_ALPHA_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_ALPHA_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_INTERVAL_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_ALPHA_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_ALPHA_CHANGE,
  TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_COLOR_CHANGE,
  TRACK_COMPOSE_SUBMIT_REQUEST,
  TRACK_COMPOSE_SUBMIT_SUCCESS,
  TRACK_COMPOSE_SUBMIT_FAIL,
} from '../actions/track_compose';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  error: null,
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
          movement: { threshold: 150, band: { bottom: 50, top: 300 } },
          blink: { threshold: 150, band: { bottom: 2000, top: 15000 } },
        },
      },
      particle: {
        visible: false,
        params: {
          alpha: 1,
          color: 0xffffff,
          limit: { threshold: 150, band: { bottom: 300, top: 2000 } },
        },
      },
      lightleaks: { visible: false, params: { alpha: 1 } },
      spectrum: {
        visible: true,
        params: {
          mode: 2,
          alpha: 1,
          color: 0xffffff,
        },
      },
      text: { visible: true, params: { alpha: 0.9, color: 0xffffff } },
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
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_ALPHA_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'params', 'alpha'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'params', 'color'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE:
    return state.setIn(['track', 'video', 'particle', 'params', 'limit', 'threshold'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE:
    return state.setIn(['track', 'video', 'lightleaks', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_ALPHA_CHANGE:
    return state.setIn(['track', 'video', 'lightleaks', 'params', 'alpha'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_INTERVAL_CHANGE:
    return state.setIn(['track', 'video', 'lightleaks', 'params', 'interval'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'params', 'mode'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_ALPHA_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'params', 'alpha'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE:
    return state.setIn(['track', 'video', 'spectrum', 'params', 'color'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE:
    return state.setIn(['track', 'video', 'text', 'visible'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_ALPHA_CHANGE:
    return state.setIn(['track', 'video', 'text', 'params', 'alpha'], action.value);
  case TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_COLOR_CHANGE:
    return state.setIn(['track', 'video', 'text', 'params', 'color'], action.value);
  case TRACK_COMPOSE_SUBMIT_REQUEST:
    return state.set('is_submitting', true).set('error', initialState.get('error'));
  case TRACK_COMPOSE_SUBMIT_SUCCESS:
    return initialState;
  case TRACK_COMPOSE_SUBMIT_FAIL:
    return state.set('is_submitting', false).set('error', action.error);
  default:
    return state;
  }
}
