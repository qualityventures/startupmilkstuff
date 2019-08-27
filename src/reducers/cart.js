import {
  CART_SET_PRODUCTS,
} from 'actions/cart';

const initialState = {
  products_list: {},
  products_amount: 0,
  price_total: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CART_SET_PRODUCTS: {
      const newState = {
        price_total: action.total,
        products_list: {},
        products_amount: action.products.length,
      };

      action.products.forEach((product) => {
        newState.products_list[product.id] = { ...product };
      });

      return newState;
    }

    default: {
      return state;
    }
  }
}
