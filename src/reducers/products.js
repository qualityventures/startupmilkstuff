import {
  PRODUCTS_LOADING,
  PRODUCTS_LOAD_SUCCESS,
  PRODUCTS_LOAD_ERROR,
} from 'actions/products';

const initialState = {
  loaded: false,
  loading: false,
  error: false,
  data: {},
  query: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_LOADING: {
      const newState = { ...state };

      newState.loading = true;
      newState.error = false;
      newState.query = { ...action.query };
      newState.data = {};
      newState.loaded = false;

      return newState;
    }

    case PRODUCTS_LOAD_ERROR: {
      const newState = { ...state };

      newState.loading = false;
      newState.error = action.error;
      newState.loaded = true;

      return newState;
    }

    case PRODUCTS_LOAD_SUCCESS: {
      const newState = { ...state };

      newState.loading = false;
      newState.loaded = true;
      newState.data = { ...action.data };

      return newState;
    }

    default: {
      return state;
    }
  }
}
