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
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_MOVEMENT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_MOVEMENT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_BLUR_BLINK_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_BLUR_BLINK_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_LIMIT_THRESHOLD_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_LIMIT_THRESHOLD_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_INTERVAL_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_INTERVAL_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_MODE_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_MODE_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_COLOR_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_ALPHA_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_ALPHA_CHANGE';
export const TRACK_COMPOSE_TRACK_VIDEO_TEXT_COLOR_CHANGE = 'TRACK_COMPOSE_TRACK_VIDEO_TEXT_COLOR_CHANGE';
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

function appendParamToFormData(formData, prefix, value) {
  if (!value.get('visible')) {
    return;
  }

  for (const [childKey, childValue] of value) {
    if (childKey === 'visible') {
      continue;
    }

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

    if (track.get('music')) {
      formData.append('music', track.get('music'));
    }
    formData.append('title', track.get('title'));
    formData.append('artist', track.get('artist'));
    formData.append('text', track.get('text'));
    formData.append('visibility', track.get('visibility'));

    if (image) {
      formData.append('video[image]', image);
    }

    appendParamToFormData(formData, 'video[blur]', blur);
    appendParamToFormData(formData, 'video[particle]', particle);
    appendParamToFormData(formData, 'video[lightleaks]', lightLeaks);
    appendParamToFormData(formData, 'video[spectrum]', spectrum);
    appendParamToFormData(formData, 'video[text]', text);

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

export function changeTrackComposeTrackVideoBlurMovementThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_BLUR_MOVEMENT_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoBlurBlinkThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_BLUR_BLINK_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_VISIBLITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_COLOR_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoParticleLimitThreshold(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_PARTICLE_LIMIT_THRESHOLD_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_VISIBILITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoLightLeaksInterval(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_LIGHTLEAKS_INTERVAL_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumVisiblity(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_VISIBLITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumMode(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_MODE_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoSpectrumColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_SPECTRUM_COLOR_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextVisibility(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_VISIBILITY_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextAlpha(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_ALPHA_CHANGE,
    value,
  };
};

export function changeTrackComposeTrackVideoTextColor(value) {
  return {
    type: TRACK_COMPOSE_TRACK_VIDEO_TEXT_COLOR_CHANGE,
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
