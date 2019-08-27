/* global DEV_SERVER_HOST */
/* global DEV_SERVER_PORT */

const modules = [
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
  'webpack/hot/only-dev-server',
];

module.exports = function insertHMR(entry) {
  const entry_type = typeof entry;

  if (entry_type === 'string') {
    return [
      modules[0],
      modules[1],
      modules[2],
      entry,
    ];
  }

  if (entry_type === 'object' && !Array.isArray(entry)) {
    const keys = Object.keys(entry);
    const ret = {};

    for (let i = 0; i < keys.length; ++i) {
      ret[keys[i]] = insertHMR(entry[keys[i]], false);
    }

    return ret;
  }

  if (typeof entry === 'object' && Array.isArray(entry)) {
    const ret = [];

    for (let i = 0; i < entry.length; ++i) {
      ret[i] = entry[i];
    }
    
    ret.unshift(modules[2]);
    ret.unshift(modules[1]);
    ret.unshift(modules[0]);

    return ret;
  }

  return entry;
};
