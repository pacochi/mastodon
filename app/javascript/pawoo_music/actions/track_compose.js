import Immutable from 'immutable';
import api from '../../mastodon/api';

export const TRACK_COMPOSE_BASIC_TAB_FOCUS = 'TRACK_COMPOSE_BASIC_TAB_FOCUS';
export const TRACK_COMPOSE_VIDEO_TAB_FOCUS = 'TRACK_COMPOSE_VIDEO_TAB_FOCUS';
export const TRACK_COMPOSE_TRACK_TITLE_CHANGE = 'TRACK_COMPOSE_TRACK_TITLE_CHANGE';
export const TRACK_COMPOSE_TRACK_ARTIST_CHANGE = 'TRACK_COMPOSE_TRACK_ARTIST_CHANGE';
export const TRACK_COMPOSE_TRACK_TEXT_CHANGE = 'TRACK_COMPOSE_TRACK_TEXT_CHANGE';
export const TRACK_COMPOSE_TRACK_VISIBILITY_CHANGE = 'TRACK_COMPOSE_TRACK_VISIBILITY_CHANGE';
export const TRACK_COMPOSE_TRACK_MUSIC_CHANGE = 'TRACK_COMPOSE_TRACK_MUSIC_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_INTERVAL_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_INTERVAL_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_COLOR_CHANGE';
export const TRACK_COMPOSE_SUBMIT_REQUEST = 'TRACK_COMPOSE_SUBMIT_REQUEST';
export const TRACK_COMPOSE_SUBMIT_SUCCESS = 'TRACK_COMPOSE_SUBMIT_SUCCESS';
export const TRACK_COMPOSE_SUBMIT_FAIL = 'TRACK_COMPOSE_SUBMIT_FAIL';

function appendMapToFormData(formData, prefix, value) {
  for (const [childKey, childValue] of value) {
    const childPrefix = `${prefix}[${childKey}]`;

    if (Immutable.Map.isMap(childValue)) {
      appendMapToFormData(formData, childPrefix, childValue);
    } else {
      formData.append(childPrefix, childValue);
    }
  }
}

export function submitTrackCompose() {
  return function (dispatch, getState) {
    const state = getState();
    const formData = new FormData;
    const track = state.getIn(['pawoo_music', 'track_compose', 'track']);
    const video = track.get('video');
    const image = video.get('image');
    const blur = video.get('blur');
    const particle = video.get('particle');
    const lightLeaks = video.get('lightleaks');
    const spectrum = video.get('spectrum');
    const text = video.get('text');

    formData.append('music', track.get('music'));
    formData.append('title', track.get('title'));
    formData.append('artist', track.get('artist'));
    formData.append('text', track.get('text'));
    formData.append('visibility', track.get('visibility'));

    if (image) {
      formData.append('video[image]', image);
    }

    if (blur.get('visible')) {
      appendMapToFormData(formData, 'video[blur]', blur.get('params'));
    }

    if (particle.get('visible')) {
      appendMapToFormData(formData, 'video[particle]', particle.get('params'));
    }

    if (lightLeaks.get('visible')) {
      appendMapToFormData(formData, 'video[lightleaks]', lightLeaks.get('params'));
    }

    if (spectrum.get('visible')) {
      appendMapToFormData(formData, 'video[spectrum]', spectrum.get('params'));
    }

    if (text.get('visible')) {
      appendMapToFormData(formData, 'video[text]', text.get('params'));
    }

    dispatch(submitTrackComposeRequest());
    api(getState).post('/api/v1/tracks', formData).then(function ({ data: { id } }) {
      dispatch(submitTrackComposeSuccess(id));
    }).catch(function (error) {
      dispatch(submitTrackComposeFail(error));
    });
  };
};

export function focusTrackComposeBasicTab() {
  return {
    type: TRACK_COMPOSE_BASIC_TAB_FOCUS,
  };
};

export function focusTrackComposeVideoTab() {
  return {
    type: TRACK_COMPOSE_VIDEO_TAB_FOCUS,
  };
};

export function changeTrackComposeTrackMusic(value) {
  return {
    type: TRACK_COMPOSE_TRACK_MUSIC_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackTitle(value) {
  return {
    type: TRACK_COMPOSE_TRACK_TITLE_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackArtist(value) {
  return {
    type: TRACK_COMPOSE_TRACK_ARTIST_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackText(value) {
  return {
    type: TRACK_COMPOSE_TRACK_TEXT_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoImage(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoBlurVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoBlurParamMovementThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoBlurParamBlinkThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleParamAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleParamColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleParamLimitThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksParamAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksParamInterval(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_PARAM_INTERVAL_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumVisiblity(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumParamMode(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumParamAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumParamColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextParamAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextParamColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_PARAM_COLOR_CHANGE,
    value,
  };
};

export function submitTrackComposeRequest() {
  return {
    type: TRACK_COMPOSE_SUBMIT_REQUEST,
  };
};

export function submitTrackComposeSuccess(value) {
  return {
    type: TRACK_COMPOSE_SUBMIT_SUCCESS,
    value,
  };
};

export function submitTrackComposeFail(error) {
  return {
    type: TRACK_COMPOSE_SUBMIT_FAIL,
    error,
  };
};
