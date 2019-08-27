/* global NODE_ENV */
/* eslint-disable no-console */

import React from 'react';
import ReactDOM from 'react-dom/server';
import Express from 'express';
import path from 'path';
import url from 'url';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import busboy from 'connect-busboy';
import { StaticRouter } from 'react-router';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import clientRoutes from 'routes/client';
import apiRoutes from 'api';
import ClientContainer from 'containers/client-container';
import AdminContainer from 'containers/admin-container';
import configureStore from 'reducers';
import { renderHTML } from 'helpers/ssr';
import { throwInternalServerError } from 'helpers/response';
import { MONGO } from 'data/config.private';
import mongoose from 'mongoose';
import { userSignIn } from 'actions/user';
import { tokenSet } from 'actions/token';
import { setCartProducts } from 'actions/cart';
import { loadUserData, loadCartInfo } from 'helpers/middlewares';
import cors from 'cors';

const debug = require('debug')('matte.design:ssr');
require('es6-promise').polyfill();
require('isomorphic-fetch');

mongoose
  .connect(
    MONGO.url,
    MONGO.options
  )
  .then(() => {
    debug('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Please check your MongoDB connection parameters');
    process.exit(1);
  });

const app = new Express();

app.disable('x-powered-by');
app.timeout = 600000;
app.keepAliveTimeout = 1000;

const staticOptions = {
  expires: '1M',
  etag: false,
  setHeaders: (res) => {
    res.set({ 'Cache-Control': 'public', ETag: '' });
  },
};

if (NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

app.use(
  cors({
    origin: ['http://localhost:3020', 'http://localhost:3019', 'https://startupmilk.com/', 'https://js.stripe.com'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(compression());
app.use(busboy({ immediate: false, limits: { fileSize: 1024 * 1024 * 1024 } }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/favicon.ico', Express.static(path.join(__dirname, '..', 'public', 'static', 'favicons', 'favicon.ico'), staticOptions));
app.use('/apple-touch-icon.png', Express.static(path.join(__dirname, '..', 'public', 'static', 'favicons', 'apple-touch-icon.png'), staticOptions));
app.use('/images', Express.static(path.join(__dirname, '..', 'public', 'images'), staticOptions));
app.use('/assets', Express.static(path.join(__dirname, '..', 'public', 'assets'), staticOptions));
app.use('/static', Express.static(path.join(__dirname, '..', 'public', 'static'), staticOptions));
app.use(loadUserData);
app.use(loadCartInfo);
app.use('/api', apiRoutes);

// process request
app.use((req, res) => {
  const store = configureStore();
  const context = {};
  let location = url.parse(req.url);
  location = { pathname: location.pathname, search: location.query, query: location.query };
  let body = '';
  let type = 'client';
  let promises = [];
  const is_admin = location.pathname.indexOf('/admin') === 0;

  if (req.jwtToken && req.userData.email) {
    store.dispatch(tokenSet(req.jwtToken));
    store.dispatch(userSignIn(req.userData));
  }

  if (req.cartData) {
    store.dispatch(setCartProducts(req.cartData.toClientJSON()));
  }

  if (is_admin) {
    type = 'admin';
  } else {
    // find matched route
    clientRoutes.some((route) => {
      const match = matchPath(location.pathname, route);

      if (match && route.fetchData) {
        promises = route.fetchData(location, store, match);
      }

      return match;
    });
  }

  Promise.all(promises)
    .then(() => {
      if (is_admin) {
        // render content
        body = ReactDOM.renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <AdminContainer />
            </StaticRouter>
          </Provider>
        );
      } else {
        // render content
        body = ReactDOM.renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <ClientContainer />
            </StaticRouter>
          </Provider>
        );
      }

      // check for redirect
      if (context.url) {
        res.set({ Location: context.url });
        res.status(301).end();
        return;
      }

      // make HTML response
      const content = renderHTML(body, store.getState(), type);

      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
        ETag: '',
      });

      res.status(context.status || 200).end(content);
    })
    .catch((error) => {
      debug(error);
      throwInternalServerError(res);
    });
});

export default app;
