/* global DEBUG_PREFIX */

import { throwError } from 'helpers/response';
import debug from 'debug';
import User from 'models/user';

const log = debug(`${DEBUG_PREFIX}:controller.orders`);

export function exportCSVEmails(req, res) {
  User.find({})
    .then((users) => {
      /* eslint-disable quotes */
      let buffer = `"Email"\n`;

      users.forEach((user) => {
        buffer += `"${user.email}"\n`;
      });

      res.set({
        'Content-Disposition': `attachment; filename=emails-export.csv`,
        'Content-Type': 'text/csv',
        'Content-Length': Buffer.byteLength(buffer, 'utf8'),
        ETag: '',
      });

      res.status(200).send(buffer);
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while loading users';
      log(error);
      throwError(res, error);
    });
}
