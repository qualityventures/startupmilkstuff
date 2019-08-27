/* global NODE_ENV */

import fs from 'fs';
import path from 'path';
import { TITLE_BASE, TITLE_SEPARATOR } from 'data/config.public';

let _bundle_cache = {};
let _bundle_updated = 0;

function getBundleCache() {
  const time = Math.round(new Date().getTime() / 1000);
  if ((time - _bundle_updated) < 5) {
    return _bundle_cache;
  }

  try {
    const file = path.join(__dirname, '..', '..', 'bundle-cache.json');
    const content = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(content);

    _bundle_cache = json;
  } catch (err) {
    // 
  }

  _bundle_updated = time;
  return _bundle_cache;
}

/**
 *  Make path to script
 */
function makePathToAsset(bundle, ext) {
  const cache = getBundleCache();

  if (!cache[bundle]) {
    return '';
  }

  if (!cache[bundle][ext]) {
    return '';
  }

  if (ext === 'js') {
    return `<script src="/assets/${cache[bundle][ext]}" async></script>`;
  }

  if (ext === 'css') {
    return `<link href="/assets/${cache[bundle][ext]}" rel="stylesheet" />`;
  }

  return '';
}

export function renderHTML(content, state = {}, type = 'client') {
  let scripts = '';
  let styles = '';
  let title = TITLE_BASE

  if (NODE_ENV === 'dev') {
    scripts = `<script src="/assets/${type}.js" async></script>`;
  } else {
    scripts = makePathToAsset(type, 'js');
    styles = makePathToAsset(type, 'css');
  }

  if (state.title) {
    title = `${state.title} ${TITLE_SEPARATOR} ${TITLE_BASE}`;
  }

  if (type === 'client') {
    scripts += `
      <div class="metrics">
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111430722-2"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-111430722-2');
        </script>
      </div>
    `.trim();
  }

  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="alternate" hreflang="x-default" href="//startupmilk.co/" />
        <link href="https://unpkg.com/basscss@8.0.2/css/basscss.min.css" rel="stylesheet">
        <title>${title}</title>
        <meta name="format-detection" content="telephone=no">
        <meta name="format-detection" content="address=no">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        ${styles}
        <script src="/static/js/jquery.js"></script>
        <script src="/static/js/migrate.js"></script>
        <script src="/static/js/library.js"></script>
        <script src="/static/js/script.js"></script>
        <script id="stripe-js" src="https://js.stripe.com/v3/"></script>
      </head>
      <body style="padding: 0px; margin: 0px;" class="no-js" id="top">
        <div id="react-root">${content}</div>
        <script>window.REDUX_INITIAL_STATE=${JSON.stringify(state)};</script>
        ${scripts}
      </body>
    </html>
  `.trim().replace(/^ {4}/gm, '');

  return html;
}
