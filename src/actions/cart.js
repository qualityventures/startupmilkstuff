import apiFetch from 'helpers/api-fetch';

export const CART_SET_PRODUCTS = 'cart:set_products';

export function setCartProducts({ products, total }) {
  return { type: CART_SET_PRODUCTS, products, total };
}

export function clearCart() {
  return { type: CART_SET_PRODUCTS, products: [], total: 0 };
}

export function addToCart(product_id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      apiFetch(`api/cart/add/${product_id}`, { method: 'POST' })
        .then((data) => {
          dispatch(setCartProducts(data));
          resolve();
        })
        .catch((error) => {
          resolve();
        });
    });
  };
}

export function removeFromCart(product_id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      apiFetch(`api/cart/remove/${product_id}`, { method: 'POST' })
        .then((data) => {
          dispatch(setCartProducts(data));
          resolve();
        })
        .catch((error) => {
          resolve();
        });
    });
  };
}
