/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
 
// env
const WEBPACK_MODE = process.env.WEBPACK_MODE || 'build';
const NODE_ENV = process.env.NODE_ENV || 'production';
const NODE_MODE = 'client';
 
// config 
const WEBPACK_ENTRY = {
  client: ['client'],
  admin: ['admin'],
};
const PUBLIC_PATH = '/assets/';
const CONTENT_BASE = './public';
const SOURCE_PATH = './src';
const EXTRACT_CSS = true;

// dev server & proxy settings
const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 3019;
const DEV_SERVER_HOST = process.env.DEV_SERVER_HOST || '0.0.0.0';
const DEV_SERVER_PROXY_PORT = process.env.DEV_SERVER_PROXY_PORT || 3020;
const DEV_SERVER_PROXY_HOST = process.env.DEV_SERVER_PROXY_HOST || '0.0.0.0';

// build paths
const ROOT_PATH = path.join(__dirname, '..', SOURCE_PATH);
const BUILD_PATH = path.join(__dirname, '..', `${CONTENT_BASE}${PUBLIC_PATH}`);

process.chdir(path.join(__dirname, '..'));

// define globals
global.WEBPACK_ENTRY = WEBPACK_ENTRY;
global.ROOT_PATH = ROOT_PATH;
global.BUILD_PATH = BUILD_PATH;
global.PUBLIC_PATH = PUBLIC_PATH;
global.NODE_ENV = NODE_ENV;
global.NODE_ENV = NODE_ENV;
global.NODE_MODE = NODE_MODE;
global.WEBPACK_MODE = WEBPACK_MODE;
global.DEV_SERVER_HOST = DEV_SERVER_HOST;
global.DEV_SERVER_PORT = DEV_SERVER_PORT;
global.EXTRACT_CSS = EXTRACT_CSS;
global.DEBUG_PREFIX = 'milkicons_';

// init webpack with config
const compiler = webpack(require(path.join(__dirname, '..', 'webpack', 'config')));

// build bundle
if (WEBPACK_MODE === 'build') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log(stats.toString({ chunks: false, colors: true }));
  });
}

// build bundle & watch updates
if (WEBPACK_MODE === 'watch') {
  compiler.watch(
    { aggregateTimeout: 300, poll: true },
    (err, stats) => {
      if (err) throw new Error(err);
      console.log(stats.toString({ chunks: false, colors: true }));
    }
  );
}

// run webpack-dev-server
if (WEBPACK_MODE === 'server') {
  let proxy = false;
  const config = {
    hot: true,
    historyApiFallback: true,
    compress: true,
    quiet: false,
    noInfo: false,
    publicPath: PUBLIC_PATH,
    contentBase: [
      CONTENT_BASE,
      `${CONTENT_BASE}${PUBLIC_PATH}`,
    ],
    stats: { 
      assets: true,
      timings: true,
      warnings: true,
      chunks: false,
      colors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    disableHostCheck: true,
  };

  if (DEV_SERVER_PROXY_HOST && DEV_SERVER_PROXY_PORT) {
    proxy = `http://${DEV_SERVER_PROXY_HOST}:${DEV_SERVER_PROXY_PORT}`;
    config.proxy = { '**': proxy };
  }

  const server = new WebpackDevServer(compiler, config);

  server.listen(DEV_SERVER_PORT, DEV_SERVER_HOST, (err) => {
    if (err) throw new Error(err);

    console.log(`Listening at ${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`);
    if (proxy) console.log(`Proxying to ${proxy}`);
  });
}

// profiler
if (WEBPACK_MODE === 'profile') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log('%j', stats.toJson());
  });
}
