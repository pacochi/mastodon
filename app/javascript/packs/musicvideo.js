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
  const locale = JSON.parse(document.getElementById('pawoo-music-default-props').getAttribute('data-props')).locale;
  const track = JSON.parse(mountNode.getAttribute('data-props')).track;

  ReactDOM.render(<MusicvideoEntry {...{ locale, track }} />, mountNode);
}

function main() {
  onDomContentLoaded(loaded);
}

loadPolyfills().then(main).catch(e => {
  console.error(e);
});
