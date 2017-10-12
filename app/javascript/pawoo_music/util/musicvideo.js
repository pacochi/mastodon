export function convertToRgbObject (color) {
  return { r: (0xff & (color >> 16)), g: (0xff & (color >> 8)), b: (0xff & color) };
};

export function convertToRgbCode (color) {
  return `rgb(${0xff & (color >> 16)},${0xff & (color >> 8)},${0xff & color})`;
};

export function constructGeneratorOptions(track, image) {
  const video = track.get('video');
  const lightleaks = video.get('lightleaks');
  const blur = video.get('blur');
  const particle = video.get('particle');
  const spectrum = video.get('spectrum');

  const options = {
    image,
    text: { title: track.get('title'), sub: track.get('artist') },
  };

  // フォームの場合はvisibleキーとparamsキーが存在する
  if (blur) {
    if (blur.has('visible')) {
      if (blur.get('visible')) {
        options.blur = blur.get('params').toJS();
      }
    } else {
      options.blur = blur.toJS();
    }
  }

  if (particle) {
    if (particle.has('visible')) {
      if (particle.get('visible')) {
        options.particle = particle.get('params').toJS();
      }
    } else {
      options.particle = particle.toJS();
    }
  }

  if (lightleaks) {
    if (lightleaks.has && lightleaks.has('visible')) {
      options.lightLeaks = lightleaks.get('visible');
    } else {
      options.lightLeaks = lightleaks;
    }
  }

  if (spectrum) {
    if (spectrum.has('visible')) {
      if (spectrum.get('visible')) {
        options.spectrum = spectrum.get('params').toJS();
      }
    } else {
      options.spectrum = spectrum.toJS();
    }
  }

  return options;
}
