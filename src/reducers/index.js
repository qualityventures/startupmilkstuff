/* global NODE_ENV */

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import token from './token';
import app from './app';
import user from './user';
import products from './products';
import product from './product';
import cart from './cart';
import modals from './modals';

export default function (state = {}) {
  const reducer = combineReducers({
    app,
    token,
    user,
    products,
    product,
    cart,
    modals,
  });

  let composeEnhancers = compose;

  if (NODE_ENV === 'dev') {
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const enhancer = composeEnhancers(applyMiddleware(thunk));
  
  return createStore(reducer, state, enhancer);
}
