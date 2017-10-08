import loadPolyfills from '../mastodon/load_polyfills';

function onDomContentLoaded(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function loaded() {
  const MusicvideoEntry = require('../pawoo_music/entries/musicvideo').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('pawoo-music-musicvideo');
  const props = JSON.parse(mountNode.getAttribute('data-props'));

  ReactDOM.render(<MusicvideoEntry {...props} />, mountNode);
}

function main() {
  onDomContentLoaded(loaded);
}

loadPolyfills().then(main).catch(e => {
  console.error(e);
});
