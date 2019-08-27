import {
  SET_TITLE,
  SHOW_CART,
  HIDE_CART,
} from 'actions/app';

const initialState = {
  title: '',
  show_cart: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TITLE: {
      return { ...state, title: action.title };
    }

    case SHOW_CART: {
      return { ...state, show_cart: true };
    }

    case HIDE_CART: {
      return { ...state, show_cart: false };
    }

    default: {
      return state;
    }
  }
}
