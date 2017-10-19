import loadPolyfills from '../mastodon/load_polyfills';

function onDomContentLoaded(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function loaded() {
  const UploadEntry = require('../pawoo_music/entries/upload').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('pawoo-music-upload');
  const props = JSON.parse(mountNode.getAttribute('data-props'));

  ReactDOM.render(<UploadEntry {...props} />, mountNode);
}

function main() {
  onDomContentLoaded(loaded);
}

loadPolyfills().then(main).catch(e => {
  console.error(e);
});
