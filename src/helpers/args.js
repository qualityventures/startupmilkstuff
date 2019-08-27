export function makeArgs(args) {
  return Object.keys(args).map((name) => {
    let value = args[name];

    if (typeof value !== 'object') {
      value = encodeURIComponent(value);
    } else {
      value = value.escape ? encodeURIComponent(value.value) : value.value;
    }

    return `${name}=${value}`;
  }).join('&');
}

export function getArgs(search) {
  const args = {};

  if (!search) {
    return args;
  }

  search.replace(/^\?/, '').split('&').forEach((variable) => {
    if (!variable) {
      return;
    }

    variable = variable.split('=');

    if (variable.length < 2) {
      args[variable[0]] = true;
    } else {
      args[variable[0]] = decodeURIComponent(variable[1]);
    }
  });

  return args;
}
