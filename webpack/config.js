'use strict';

/* global WEBPACK_ENTRY */
/* global ROOT_PATH */
/* global BUILD_PATH */
/* global PUBLIC_PATH */
/* global NODE_ENV */
/* global NODE_MODE */
/* global WEBPACK_MODE */
/* global EXTRACT_CSS */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const insertHMR = require('./insert-hmr');

const webpackConfig = {
  context: ROOT_PATH,
  entry: WEBPACK_ENTRY,
  resolve: {
    modules: [ROOT_PATH, 'node_modules'],
    extensions: ['.js', '.jsx', '.css', '.scss'],
  },
  output: {
    path: BUILD_PATH,
    filename: NODE_ENV === 'dev' ? '[name].js' : '[name].[chunkhash:10].js',
    publicPath: PUBLIC_PATH,
    hashFunction: 'sha256',
  },
  devtool: (NODE_ENV === 'dev') ? 'cheap-module-eval-source-map' : false,
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { modules: false }],
              'stage-2',
              'react',
            ],
            plugins: (WEBPACK_MODE === 'server' ? ['react-hot-loader/babel'] : []),
          },
        }],
      },
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: (
            NODE_ENV === 'dev' ? 
              `css-loader?minimize!sass-loader?includePaths[]=${ROOT_PATH}` : 
              `css-loader?minimize!sass-loader?includePaths[]=${ROOT_PATH}`
          ),
        }),
      },
      {
        test: /\.gif$/,
        use: 'url-loader?limit=10240&mimetype=image/gif&name=[hash].[ext]',
      },
      {
        test: /\.jpg$/,
        use: 'url-loader?limit=10240&mimetype=image/jpg&name=[hash].[ext]',
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=10240&mimetype=image/png&name=[hash].[ext]',
      },
      {
        test: /\.svg/,
        use: 'url-loader?limit=10240&mimetype=image/svg+xml&name=[hash].[ext]',
      },
      {
        test: /\.(woff|woff2|ttf|eot)/,
        use: 'url-loader?limit=1&name=[hash].[ext]',
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      NODE_MODE: JSON.stringify(NODE_MODE),
      DEBUG_PREFIX: JSON.stringify(DEBUG_PREFIX),
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        NODE_MODE: JSON.stringify(NODE_MODE),
        DEBUG_PREFIX: JSON.stringify(DEBUG_PREFIX),
      },
    }),
    new ExtractTextPlugin({
      filename: NODE_ENV === 'dev' ? '[name].css' : '[name].[contenthash:10].css',
      allChunks: true,
      disable: (!EXTRACT_CSS || NODE_ENV === 'dev'),
    }),
    function () {
      this.plugin('done', (stats) => {
        const ret = { };
        const chunks = stats.toJson().assetsByChunkName || {};

        Object.keys(chunks).forEach((chunk) => {
          ret[chunk] = {};

          if (typeof chunks[chunk] === 'string') {
            chunks[chunk] = [chunks[chunk]];
          }

          chunks[chunk].forEach((file) => {
            const pos = file.lastIndexOf('.');

            if (pos <= 0) {
              return;
            }

            const ext = file.substring(pos + 1);

            if (!ext || ret[chunk][ext]) {
              return;
            }

            ret[chunk][ext] = file;
          });
        });

        fs.writeFileSync(path.join(__dirname, '..', 'bundle-cache.json'), JSON.stringify(ret));
      });
    },
  ],
};

// Additional config for production
// UglifyJsPlugin & DedupePlugin
if (NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      warnings: false,
      drop_console: false,
      comments: false,
      sourceMap: false,
      output: {
        comments: false,
      },
      compressor: {
        warnings: false,
      },
    })
  );
}

// Additional config for dev-server
if (WEBPACK_MODE === 'server') {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  webpackConfig.output.chunkFilename = '[id].js?[hash]';

  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin()
  );

  webpackConfig.entry = insertHMR(webpackConfig.entry);
}

module.exports = webpackConfig;
