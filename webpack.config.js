var webpack = require('webpack');
var path = require('path');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

var __DEV__ = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    bundle: './client'
  },
  devtool: __DEV__ ? 'inline-source-map' : null,
  output: {
    filename: __DEV__ ? 'bundle.js' : 'bundle-[hash].js',
    chunkFilename: __DEV__ ?
      'bundle-[name].js' :
      'bundle-[name]-[chunkhash].js',
    path: path.join(__dirname, '/public/js'),
    publicPath: __DEV__ ? `http://localhost:${process.env.PORT || 3000}/js` : '/js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'client/'),
          path.join(__dirname, 'common/')
        ],
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.json$/,
        loaders: [
          'json-loader'
        ]
      }
    ]
  },
  externals: {
    codemirror: 'CodeMirror',
    'loop-protect': 'loopProtect'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(__DEV__ ? 'development' : 'production')
      },
      __DEVTOOLS__: !__DEV__
    })
  ]
};

if (!__DEV__) {
  module.exports.plugins.push(
    new ManifestPlugin({ fileName: 'react-manifest.json' }),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    })
  );
} else {
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}
