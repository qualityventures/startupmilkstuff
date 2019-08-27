import jwt from 'jsonwebtoken';
import User from 'models/user';
import Order from 'models/order';
import Cart from 'models/cart';
import Products from 'models/products';
import { JWT_SECRET } from 'data/config.private';
import { throwUnauthorizedAccess, throwError } from 'helpers/response';
import debug from 'debug';

const log = debug('matte.design:middlewares');

export function loadOrderInfo(req, res, next) {
  const { order_id } = req.params;

  if (!order_id || !order_id.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid order id');
    return;
  }

  Order.findById(order_id)
    .populate('user')
    .populate('list')
    .then((order) => {
      if (order === null) {
        throw new Error('Order not found');
      }

      req.orderData = order;
      next();
    })
    .catch((e) => {
      const error = e && e.toString ? e.toString() : 'Error while loading order';
      log(e);
      throwError(res, error);
    });
}

export function loadCartInfo(req, res, next) {
  const { cookie } = req.headers;
  req.cartData = false;

  if (!cookie) {
    next();
    return;
  }

  const match = cookie.match(/cart_id=([^\s;]+)/i);

  if (!match) {
    next();
    return;
  }

  const token = match[1];
  let payload = false;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    payload = false;
  }

  if (!payload || !payload.id) {
    next();
    return;
  }

  Cart.findById(payload.id)
    .populate('list')
    .then((cart) => {
      if (cart) {
        req.cartData = cart;
      }
      next();
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Internal server error';
      log(error);
      throwError(res, error);
    });
}

export function loadProductInfo(req, res, next) {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid id');
    return;
  }

  Products.findById(id)
    .populate('related')
    .then((product) => {
      if (product === null) {
        throw new Error('Product not found');
      }

      req.productData = product;
      next();
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Internal server error';
      log(error);
      throwError(res, error);
    });
}

export function loadUserData(req, res, next) {
  const { cookie } = req.headers;
  req.userData = {};
  req.jwtToken = false;

  if (!cookie) {
    next();
    return;
  }

  const match = cookie.match(/auth_jwt=([^\s;]+)/i);

  if (!match) {
    next();
    return;
  }

  const token = match[1];
  let payload = false;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    payload = false;
  }

  if (!payload || !payload.email) {
    next();
    return;
  }

  User.findOne({ email: payload.email })
    .then((user) => {
      if (user === null) {
        next();
        return;
      }

      req.userData = user.toClientJSON();
      req.jwtToken = token;
      
      next();
    })
    .catch(() => {
      next();
    });
}

export function checkAdminAccess(req, res, next) {
  const { email, role } = req.userData;

  if (!email) {
    throwUnauthorizedAccess(res, 'No token provided');
    return;
  }

  if (role !== 'admin') {
    throwUnauthorizedAccess(res, 'Access denied');
    return;
  }

  next();
}

export function checkUserAccess(req, res, next) {
  const { email } = req.userData;

  if (!email) {
    throwUnauthorizedAccess(res, 'Access denied');
    return;
  }

  next();
}
