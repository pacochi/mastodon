const perf = require('./performance');

// import default stylesheet with variables
require('font-awesome/css/font-awesome.css');
<<<<<<< HEAD
require('../styles/custom.scss');
=======
require('mastodon-application-style');
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe

function onDomContentLoaded(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function main() {
  perf.start('main()');
  const Mastodon = require('mastodon/containers/mastodon').default;
  const React = require('react');
  const ReactDOM = require('react-dom');

  require.context('../images/', true);

  onDomContentLoaded(() => {
    const mountNode = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<Mastodon {...props} />, mountNode);
    perf.stop('main()');
  });
}

export default main;
