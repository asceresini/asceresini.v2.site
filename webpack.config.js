const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: ['whatwg-fetch', './browser/index.js'],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.(html|css|svg)$/,
        loader: "file?name=[name].[ext]?[hash]"
      },
      {
        test: /\.ico$/,
        loader: "file?name=[name].[ext]"
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  target: 'web'
};
