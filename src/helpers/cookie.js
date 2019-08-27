function escape(value) {
  value += '';
  return value.replace(/[;\s\n\r=,$"\\]/g, '');
}

export function setCookie(name, value, expires) {
  if (typeof document === 'undefined') {
    return;
  }

  expires = parseInt(expires, 10);

  if (isNaN(expires)) {
    expires = '';
  } else {        
    const date = new Date();
    date.setTime(date.getTime() + (expires * 1000));
    expires = '; expires=' + date.toGMTString();
  }

  name = escape(name);
  value = escape(value);

  if (name.length < 1) return;

  document.cookie = `${name}=${value}${expires};path=/;`;
}

export function removeCookie(name) {
  setCookie(name, '', -86400 * 365);
}

export function getCookie(name) {
  if (typeof document === 'undefined') {
    return false;
  }
  
  const cookies = document.cookie.split(';');
  name = escape(name) + '=';

  for (let i = 0; i < cookies.length; ++i) {
    const cookie = cookies[i].trim();

    if (cookie.indexOf(name) !== 0) continue;

    return cookie.substring(name.length);
  }

  return '';
}
