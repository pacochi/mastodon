const { resolve } = require('path');

module.exports = {
  resolve: {
    alias: {
      mastodon: resolve(__dirname, 'app/javascript/mastodon'),
    },
  },
};
