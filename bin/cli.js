/* global NODE_ENV */
/* global NODE_PORT */

const fs = require('fs');
const path = require('path');
const babelrc = fs.readFileSync('./.babelrc');
let config;

global.DEBUG_PREFIX = 'milkicons_';
global.ROOT_PATH = path.join(__dirname, '..', 'src');

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error(`Error parsing .babelrc: ${err}`);
  process.exit(1);
}

require('babel-core/register')(config);
const cli = require(path.join(global.ROOT_PATH, 'cli'));

const argv = require('minimist')(process.argv.slice(2));
const script = argv._[0] || null;

if (!cli[script]) {
  console.log('Available scripts: ' + Object.keys(cli));
  process.exit(1);
} else {
  cli[script](argv);
}
