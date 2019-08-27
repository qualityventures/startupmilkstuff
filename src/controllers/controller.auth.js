/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import { validateEmail, validatePassword } from 'helpers/validators';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import debug from 'debug';
import { JWT_SECRET } from 'data/config.private';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sendmail from 'helpers/sendmail';
import bcrypt from 'bcryptjs';

const TEMPLATE_NEW_USER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'new_user.html'), 'utf8');
const TEMPLATE_RECOVER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'recover.html'), 'utf8');

const log = debug(`${DEBUG_PREFIX}:controller.auth`);

function validateUserData(req, res) {
  const { email, password, confirm } = req.body;

  const email_validation = validateEmail(email);
  const password_validation = validatePassword(password);

  if (confirm) {
    if (confirm !== password) {
      throwError(res, 'Passwords does not match the confirm password.');
      return false;
    }
  }

  if (email_validation !== true) {
    throwError(res, email_validation);
    return false;
  }

  if (password_validation !== true) {
    throwError(res, password_validation);
    return false;
  }

  return true;
}

export function authRegister(req, res) {
  if (!validateUserData(req, res)) {
    return;
  }
  const { email, password } = req.body;
  const hashed_password = bcrypt.hashSync(password, 8);
  const html = TEMPLATE_NEW_USER.replace(/%password%/gi, password).replace(/%email%/gi, email);

  User.create({
    email,
    role: 'customer',
    have_paid: false,
    hashed_password,
  })
    .then((user) => {
      if (user === null) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!user.comparePassword(password)) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        throwError(res, 'Internal server error');
        return;
      }

      const data = user.toClientJSON();
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });
      returnObjectAsJSON(res, { token, data });
    })
    .then((user) => {
      return sendmail({
        to: email,
        subject: 'Your account details',
        html,
      });
    })
    .catch((e) => {
      throwError(res, e.errmsg);
    });
}

let __last_attempt = 0;
export function authLogin(req, res) {
  if (!validateUserData(req, res)) {
    return;
  }

  const now = Date.now() / 1000;
  const diff = now - __last_attempt;
  __last_attempt = now;

  if (diff < 1) {
    throwError(res, 'Anti-spam protection');
    return;
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!user.comparePassword(password)) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        throwError(res, 'Internal server error');
        return;
      }
      const data = user.toClientJSON();
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

      returnObjectAsJSON(res, { token, data });
    })
    .catch((err) => {
      log(err);
      throwError(res, 'Invalid username or password');
    });
}

export function authRecover(req, res) {
  const { email } = req.body;
  const validation = validateEmail(email);

  if (validation !== true) {
    throwError(res, validation);
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        throw new Error('Invalid username or password');
      }

      const password = crypto.randomBytes(8).toString('hex');
      const hashed_password = bcrypt.hashSync(password, 8);
      const html = TEMPLATE_RECOVER.replace(/%password%/gi, password);

      return sendmail({
        to: email,
        subject: 'Your new password',
        html,
      }).then(() => { return { user, hashed_password }; });
    })
    .then(({ user, hashed_password }) => {
      user.hashed_password = hashed_password;
      return user.save();
    })
    .then(() => {
      returnObjectAsJSON(res, { success: true });
    })
    .catch((err) => {
      log(err);
      throwError(res, 'Error while recovering password');
    });
}
