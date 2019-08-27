/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import { hydrate } from 'react-dom';
import onload from 'helpers/onload';
import configureStore from 'reducers';
import ClientApp from 'containers/client-app';

require('es6-promise').polyfill();
require('isomorphic-fetch');

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});
  const container = document.getElementById('react-root');

  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  // React HMR
  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    hydrate(<AppContainer><ClientApp /></AppContainer>, container);

    if (typeof module !== 'undefined' && module.hot) {
      module.hot.accept('./containers/client-app', () => {
        const NewClientApp = require('containers/client-app').default;
        hydrate(<AppContainer><NewClientApp /></AppContainer>, container);
      });
    }
    
    return;
  }

  // Prod
  hydrate(<ClientApp />, container);
});
