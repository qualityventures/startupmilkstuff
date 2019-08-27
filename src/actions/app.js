export const SET_TITLE = 'app:set_title';
export const SHOW_CART = 'app:show_cart';
export const HIDE_CART = 'app:hide_cart';

export function setTitle(title) {
  return { type: SET_TITLE, title };
}

export function showCart() {
  return { type: SHOW_CART };
}

export function hideCart() {
  return { type: HIDE_CART };
}
