/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import debug from 'debug';
import Cart from 'models/cart';
import { JWT_SECRET } from 'data/config.private';
import jwt from 'jsonwebtoken';

const log = debug(`${DEBUG_PREFIX}:controller.auth`);

export function cartAddProduct(req, res) {
  if (!req.productData || !req.productData.visible) {
    throwError(res, 'Product not found');
    return;
  }

  const product_id = req.productData._id.toString();

  if (req.cartData) {
    for (let i = 0; i < req.cartData.list.length; ++i) {
      if (req.cartData.list[i]._id.toString() === product_id) {
        throwError(res, 'Product already in cart');
        return;
      }
    }

    req.cartData.list.push(product_id);
    req.cartData.save()
      .then((cart) => {
        return Cart.findById(cart._id).populate('list');
      })
      .then((cart) => {
        returnObjectAsJSON(res, cart.toClientJSON());
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Error while adding product';
        log(error);
        throwError(res, error);
      });

    return;
  }

  new Cart({ list: [product_id] }).save()
    .then((cart) => {
      return Cart.findById(cart._id).populate('list');
    })
    .then((cart) => {
      res.cookie(
        'cart_id',
        jwt.sign({ id: cart._id }, JWT_SECRET, { expiresIn: 86400 * 365 }),
        { maxAge: 1000 * 86400 * 365 }
      );
      returnObjectAsJSON(res, cart.toClientJSON());
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while adding product';
      log(error);
      throwError(res, error);
    });
}

export function cartRemoveProduct(req, res) {
  if (!req.productData || !req.productData.visible) {
    throwError(res, 'Product not found');
    return;
  }

  if (!req.cartData) {
    throwError(res, 'Cart is empty');
    return;
  }

  const product_id = req.productData._id.toString();
  let index = -1;

  for (let i = 0; i < req.cartData.list.length; ++i) {
    if (req.cartData.list[i]._id.toString() === product_id) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    returnObjectAsJSON(res, req.cartData.toClientJSON());
    return;
  }

  req.cartData.list.splice(index, 1);
  req.cartData.save()
    .then((cart) => {
      return Cart.findById(cart._id).populate('list');
    })
    .then((cart) => {
      returnObjectAsJSON(res, cart.toClientJSON());
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while removing product';
      log(error);
      throwError(res, error);
    });
}
