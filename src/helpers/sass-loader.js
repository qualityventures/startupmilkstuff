/* global ROOT_PATH */

import sass from 'node-sass';

module.exports = (data, file) => {
  try {
    return sass.renderSync({
      data,
      file,
      includePaths: [ROOT_PATH],
    }).css.toString('utf8');
  } catch (e) {
    console.error(e);
  }

  return '';
};
