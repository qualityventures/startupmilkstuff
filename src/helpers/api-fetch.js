import { API_HOST } from 'data/config.public';
import 'isomorphic-fetch';

export default function (endpoint, params = {}) {
  const query = params.query || null;
  const method = params.method || 'get';
  const payload = params.payload || null;

  let body = null;
  let url = `${API_HOST}${endpoint}`;

  const headers = {
    Accept: 'application/json',
  };

  if (payload !== null) {
    if (typeof payload === 'object') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(payload);
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      body = payload;
    }
  }

  if (query !== null) {
    url += '?';

    if (typeof query === 'object') {
      Object.keys(query).forEach((key, index) => {
        if (index > 0) {
          url += '&';
        }

        url += `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
      });
    } else {
      url += query;
    }
  }

  return fetch(url, {
    credentials: 'include',
    method: method.toUpperCase(),
    mode: 'cors',
    body,
    headers,
  })
    .then((response) => {
      return response.json().then(json => ({ json, response }));
    })
    .then(({ json, response }) => {
      if (json.error) {
        return Promise.reject(json.error);
      }

      if (response.status !== 200) {
        return Promise.reject('invalid server response');
      }

      return json;
    })
    .catch((error) => {
      return Promise.reject(typeof error === 'string' ? error : 'Invalid server response');
    });
}
