import {
  PRODUCT_LOADING,
  PRODUCT_LOAD_SUCCESS,
  PRODUCT_LOAD_ERROR,
} from 'actions/product';

const initialState = {
  loaded: false,
  loading: false,
  error: false,
  data: {},
  url: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRODUCT_LOADING: {
      const newState = { ...state };

      newState.loading = true;
      newState.error = false;
      newState.url = action.url;
      newState.data = {};
      newState.loaded = false;

      return newState;
    }

    case PRODUCT_LOAD_ERROR: {
      const newState = { ...state };

      newState.loading = false;
      newState.error = action.error;
      newState.loaded = true;

      return newState;
    }

    case PRODUCT_LOAD_SUCCESS: {
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
