/* eslint-disable valid-typeof */

export default function areEqual(a, b, level = 0) {
  if (level >= 10) {
    return false;
  }

  // they are equal
  if (a === b) {
    return true;
  }

  const type = typeof a;

  // type are not equal
  if (type !== typeof b) {
    return false;
  }

  // simple types
  if (type === 'string' || type === 'number' || type === 'boolean' || type === 'symbol' || type === 'undefined') {
    return false;
  }

  // unknow type
  if (type !== 'object') {
    return false;
  }

  const is_array = Array.isArray(a);

  // one is object, another is array
  if (is_array !== Array.isArray(b)) {
    return false;
  }

  // compare arrays
  if (is_array) {
    // check len
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; ++i) {
      if (!areEqual(a[i], b[i], level + 1)) {
        return false;
      }
    }

    return true;
  }

  // two objects, compare by keys
  const keys = Object.keys(a);

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];

    if (b[key] === undefined) {
      return false;
    }

    if (!areEqual(a[key], b[key], level + 1)) {
      return false;
    }
  }

  return true;
}
