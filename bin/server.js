/* global NODE_ENV */
/* global NODE_PORT */

const fs = require('fs');
const path = require('path');
const http = require('http');

global.DEBUG_PREFIX = 'milkicons_';
global.NODE_MODE = 'server';
global.NODE_ENV = process.env.NODE_ENV || 'production';
global.NODE_PORT = parseInt(process.env.PORT, 10) || 3020;
global.ROOT_PATH = path.join(__dirname, '..', 'src');

const debug = require('debug')(global.DEBUG_PREFIX + ':ssr');

const babelrc = fs.readFileSync('./.babelrc');
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error(`Error parsing .babelrc: ${err}`);
  process.exit(1);
}

process.chdir(global.ROOT_PATH);

require('babel-core/register')(config);
const app = require(path.join(global.ROOT_PATH, 'node-ssr')).default;

const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(NODE_PORT + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(NODE_PORT + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  if (NODE_ENV === 'dev') {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
});

server.listen(NODE_PORT);
