import FORMATS_LIST from 'data/files';

export function getFileType(ext = '') {
  ext = ext.toLowerCase();

  const keys = Object.keys(FORMATS_LIST);

  for (let i = 0; i < keys.length; ++i) {
    const type = keys[i];

    if (FORMATS_LIST[keys[i]].extensions.indexOf(ext) === -1) {
      continue;
    }

    return type;
  }

  return false;
}
