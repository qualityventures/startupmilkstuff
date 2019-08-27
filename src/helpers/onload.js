let is_loaded = false;
let callbacks = [];
const state = document.readyState;

function init() {
  is_loaded = true;

  for (let i = 0; i < callbacks.length; ++i) {
    callbacks[i]();
  }

  callbacks = null;
}

if (state === 'interactive' || state === 'complete') {
  init();
} else {
  window.addEventListener('load', init, false);
}

export default function (callback) {
  if (is_loaded) {
    callback();
    return;
  }

  callbacks.push(callback);
}
