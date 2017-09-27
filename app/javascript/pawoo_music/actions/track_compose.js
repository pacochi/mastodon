import Immutable from 'immutable';
import api from '../../mastodon/api';

export const TRACK_COMPOSE_BASIC_TAB_FOCUS = 'TRACK_COMPOSE_BASIC_TAB_FOCUS';
export const TRACK_COMPOSE_VIDEO_TAB_FOCUS = 'TRACK_COMPOSE_VIDEO_TAB_FOCUS';
export const TRACK_COMPOSE_TRACK_TITLE_CHANGE = 'TRACK_COMPOSE_TRACK_TITLE_CHANGE';
export const TRACK_COMPOSE_TRACK_ARTIST_CHANGE = 'TRACK_COMPOSE_TRACK_ARTIST_CHANGE';
export const TRACK_COMPOSE_TRACK_DESCRPITION_CHANGE = 'TRACK_COMPOSE_TRACK_DESCRPITION_CHANGE';
export const TRACK_COMPOSE_TRACK_MUSIC_CHANGE = 'TRACK_COMPOSE_TRACK_MUSIC_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_IMAGE_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_MOVEMENT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_PARAM_BLINK_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_PARAM_LIMIT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_MODE_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE';
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
    const spectrum = video.get('spectrum');

    formData.append('music', track.get('music'));
    formData.append('title', track.get('title'));
    formData.append('artist', track.get('artist'));
    formData.append('description', track.get('description'));

    if (image) {
      formData.append('video[image]', image);
    }

    if (blur.get('visible')) {
      appendMapToFormData(formData, 'video[blur]', blur.get('params'));
    }

    if (particle.get('visible')) {
      appendMapToFormData(formData, 'video[particle]', particle.get('params'));
    }

    if (spectrum.get('visible')) {
      appendMapToFormData(formData, 'video[spectrum]', spectrum.get('params'));
    }

    dispatch(submitTrackComposeRequest());
    api(getState).post('/api/v1/tracks', formData).then(function () {
      dispatch(submitTrackComposeSuccess());
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

export function changeTrackComposeTrackDescription(value) {
  return {
    type: TRACK_COMPOSE_TRACK_DESCRPITION_CHANGE,
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

export function changeTrackComposeTrackVieoSpectrumVisiblity(value) {
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

export function changeTrackComposeTrackVideoSpectrumParamColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_PARAM_COLOR_CHANGE,
    value,
  };
};

export function submitTrackComposeRequest() {
  return {
    type: TRACK_COMPOSE_SUBMIT_REQUEST,
  };
};

export function submitTrackComposeSuccess() {
  return {
    type: TRACK_COMPOSE_SUBMIT_SUCCESS,
  };
};

export function submitTrackComposeFail(error) {
  return {
    type: TRACK_COMPOSE_SUBMIT_FAIL,
    error,
  };
};
