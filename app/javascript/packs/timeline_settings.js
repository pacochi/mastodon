import loadPolyfills from '../mastodon/load_polyfills';

function onDomContentLoaded(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function loaded() {
  const TimelineSettingsEntry = require('../pawoo_music/entries/timeline_settings').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('pawoo-music-timeline-settings');
  const props = JSON.parse(mountNode.getAttribute('data-props'));

  ReactDOM.render(<TimelineSettingsEntry {...props} />, mountNode);
}

function main() {
  onDomContentLoaded(loaded);
}

loadPolyfills().then(main).catch(e => {
  console.error(e);
});
