export function constructRgbObject (color, a) {
  return {
    r: (0xff & (color >> 16)),
    g: (0xff & (color >> 8)),
    b: (0xff & color),
    a,
  };
};

export function extractRgbFromRgbObject ({ r, g, b }) {
  return (r << 16) | (g << 8) | b;
}

export function constructGeneratorOptions(track, image) {
  const video = track.get('video');

  const options = { image };

  for (const [trackKey, optionKey] of [
    ['blur', 'blur'],
    ['particle', 'particle'],
    ['lightleaks', 'lightLeaks'],
    ['spectrum', 'spectrum'],
    ['text', 'text'],
  ]) {
    const trackProperty = video.get(trackKey);

    // フォームの場合はvisibleキーとparamsキーが存在する
    if (trackProperty) {
      if (trackProperty.has('visible')) {
        if (trackProperty.get('visible')) {
          options[optionKey] = trackProperty.get('params').toJS();
        }
      } else {
        options[optionKey] = trackProperty.toJS();
      }
    }
  }

  if (options.text) {
    options.text.title = track.get('title');
    options.text.sub = track.get('artist');
  }

  return options;
}
