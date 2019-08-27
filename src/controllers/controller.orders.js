/* global DEBUG_PREFIX */
import { API_HOST } from 'data/config.public';

import { throwError, returnObjectAsJSON } from 'helpers/response';
import debug from 'debug';
import { JWT_SECRET, STRIPE_SECRET_KEY, DEV_MODE } from 'data/config.private';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import Counter from 'models/counter';
import Order from 'models/order';
import { validateEmail, validatePassword } from 'helpers/validators';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sendmail from 'helpers/sendmail';
import bcrypt from 'bcryptjs';

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const log = debug(`${DEBUG_PREFIX}:controller.orders`);

const TEMPLATE_NEW_USER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'new_user.html'), 'utf8');
const TEMPLATE_ORDER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'order.html'), 'utf8');
const TEMPLATE_ORDER_ITEM = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'order.item.html'), 'utf8');

function checkEmail(req, email) {
  return new Promise((resolve, reject) => {
    if (req.userData.email) {
      if (req.userData.email !== email) {
        reject('Invalid email');
      } else {
        resolve({ user: req.userData });
      }

      return;
    }

    User.findOne({ email }, (err, user) => {
      if (err) {
        log(err);
        reject('Invalid username or password');
        return;
      }

      if (user === null) {
        resolve();
        return;
      }

      const { password } = req.body;
      const validation = validatePassword(password);

      if (password === null) {
        reject('password_required');
        return;
      }

      if (validation !== true) {
        reject(validation);
        return;
      }

      if (!user.comparePassword(password)) {
        reject('Invalid password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        reject('Internal server error');
        return;
      }

      const data = user.toClientJSON();
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

      resolve({ auth: { data, token }, user });
    });
  });
}

export function createNewOrder(req, res) {
  const email = req.body.email || '';
  const validation = validateEmail(email);
  const subscribe = req.body.subscribe || false;
  let stripe_token = false;

  if (validation !== true) {
    throwError(res, validation);
    return;
  }

  let amount = 0;

  if (req.cartData && req.cartData.list && req.cartData.list.length) {
    req.cartData.list.forEach((product) => {
      if (!product.deleted) ++amount;
    });
  }

  if (!amount) {
    throwError(res, 'Your cart is empty');
    return;
  }

  const price = req.cartData.getPrice();

  if (price < 0) {
    throwError(res, 'Something went wrong');
    return;
  }

  if (price > 0) {
    stripe_token = req.body.stripe_token;

    if (typeof stripe_token !== 'object' || !stripe_token.id) {
      throwError(res, 'Invalid token');
      return;
    }
  }

  const globals = {};

  // check for user email
  checkEmail(req, email)
    .then((data = null) => {
      // if user exists - store it
      if (data !== null) {
        if (data.auth) globals.auth = data.auth;
        if (data.user) globals.user = data.user;
      }

      return Counter.increment('order_user_id');
    })
    .then((counter) => {
      const list = [];

      req.cartData.list.forEach((product) => {
        if (!product.deleted) {
          list.push(product._id);
        }
      });

      // create new order
      return Order.create({
        order_numeric_id: counter.next,
        email,
        stripe_token: stripe_token ? JSON.stringify(stripe_token) : null,
        stripe_charge: null,
        user: null,
        price,
        completed: false,
        list,
      });
    })
    .then((order) => {
      globals.order = order;

      // if user exists - skip
      if (globals.user) {
        if (subscribe) {
          return User.update({ _id: globals.user._id }, { $set: { subscribe: true } }).then(() => {
            return true;
          });
        }
        return true;
      }

      // if user doesn't exists - create and send email
      const password = crypto.randomBytes(8).toString('hex');
      const hashed_password = bcrypt.hashSync(password, 8);
      const html = TEMPLATE_NEW_USER.replace(/%password%/gi, password).replace(/%email%/gi, email);

      return User.create({
        email,
        role: 'customer',
        have_paid: false,
        hashed_password,
        subscribe,
      })
        .then((user) => {
          const data = { email: user.email, role: user.role };
          const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

          globals.user = user;
          globals.auth = { data, token };

          return sendmail({
            to: email,
            subject: 'Your account details',
            html,
          });
        });
    })
    .then(() => {
      // do stripe
      if (!stripe_token) {
        globals.order.completed = true;
        globals.order.user = globals.user._id;
        return globals.order.save();
      }

      let products = '';

      req.cartData.list.forEach((product) => {
        if (products) {
          products += ', ';
        }
        products += `${product.name} (${product.price ? `$${product.price}` : 'Free'})`;
      });

      return stripe.charges.create({
        amount: Math.floor(price * 100),
        currency: 'usd',
        description: `Order #${globals.order._id}. ${products.trim()}`,
        source: stripe_token.id,
      })
        .then((result) => {
          User.update({ _id: globals.user._id }, { $set: { have_paid: true } })
            .then((user) => {
              globals.user.have_paid = true;
            });
          if (!DEV_MODE && !result.livemode) {
            throw 'Livemode required';
          }

          if (!result.paid) {
            throw 'Insufficient available balance';
          }

          globals.order.completed = true;
          globals.order.user = globals.user._id;
          globals.order.stripe_charge = JSON.stringify(result);
          return globals.order.save();
        })
        .catch((error) => {
          throw (error && error.message) ? error.message : error;
        });
    })
    .then((order) => {
      let items = '';
      req.cartData.list.forEach((product) => {
        items += TEMPLATE_ORDER_ITEM
          .replace(/%name%/gi, product.name)
          .replace(/%price%/gi, product.price ? `$${product.price}` : 'Free');
      });

      const html = TEMPLATE_ORDER
        .replace(/%order_numeric_id%/gi, globals.order.order_numeric_id)
        .replace(/%items%/gi, items)
        .replace(/%total%/gi, price ? `$${price}` : 'Free')
        .replace(/%link%/gi, `https://{API_HOST}/dashboard/order/${order._id}`);

      sendmail({ to: email, subject: 'Your order details', html });

      req.cartData.list = [];
      req.cartData.save();

      returnObjectAsJSON(res, {
        success: true,
        auth: globals.auth || null,
        redirect: `/dashboard/order/${order._id}`,
      });
    })
    .catch((e) => {
      log(e);
      returnObjectAsJSON(res, {
        success: false,
        auth: globals.auth || null,
        err_msg: typeof e === 'string' ? e : 'Error while creating order',
      });
    });
}

export function getMyOrders(req, res) {
  Order.find({
    user: req.userData._id,
    completed: true,
  })
    .sort('-created')
    .populate('user')
    .populate('list')
    .then((orders) => {
      const json = orders.map((order, index) => {
        return { ...order.toClientJSON(), index };
      });

      returnObjectAsJSON(res, json);
    })
    .catch((e) => {
      const error = e && e.toString ? e.toString() : 'Error while loading orders';
      log(e);
      throwError(res, error);
    });
}

export function getOrderDetails(req, res) {
  if (req.userData.role !== 'admin' && req.userData.email !== req.orderData.email) {
    throwError(res, 'Order not found');
    return;
  }

  returnObjectAsJSON(res, req.orderData.toClientJSON());
}
