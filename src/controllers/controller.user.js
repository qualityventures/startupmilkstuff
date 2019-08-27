/* global DEBUG_PREFIX */
import User from 'models/user';
import debug from 'debug';

import { throwError, returnObjectAsJSON } from 'helpers/response';

const log = debug(`${DEBUG_PREFIX}:controller.user`);

export function userGetInfo(req, res) {
  throwError(res, 'get user info');
}

function getQuery(filter) {
  switch (filter) {
    case 'free':
      return { have_paid: { $ne: true } };
    case 'paid':
      return { have_paid: true };
    case 'newsletter':
      return { subscribe: true };
    default:
    case 'all':
      return {};
  }
}

export function getUserEmailCount(req, res) {
  const query = getQuery(req.query.filter);
  User.count(query).then((data, err) => {
    if (err) {
      log(err);
      throwError(res, 'Error while getting userEmails');
    }
    returnObjectAsJSON(res, data);
  });
}

export function getUserEmails(req, res) {
  const query = getQuery(req.query.filter);
  User.find(query)
    .limit(20)
    .skip(((req.query.page || 0) * 19))
    .then((data, err) => {
      if (err) {
        log(err);
        throwError(res, 'Error while getting userEmails');
      }
      returnObjectAsJSON(res, data);
    });
}
