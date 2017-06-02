const path = require('path');
const { env, publicPath } = require('../configuration.js');

const imagePath = path.join('app', 'javascript', 'images');
const imagePathRegexp = new RegExp(`${imagePath}/`);

module.exports = {
  test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2|mp4)$/i,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: env.NODE_ENV === 'production' ? '[path][name]-[hash].[ext]' : '[path][name].[ext]',
      outputPath(url) {
        if (imagePathRegexp.test(url)) {
          return url.replace(imagePathRegexp, '');
        } else {
          return path.basename(url);
        }
      },
    },
  }],
};
