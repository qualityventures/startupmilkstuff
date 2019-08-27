import apiFetch from 'helpers/api-fetch';

export const PRODUCTS_LOADING = 'products:loading';
export const PRODUCTS_LOAD_SUCCESS = 'products:load_success';
export const PRODUCTS_LOAD_ERROR = 'products:load_error';

function setLoading(query) {
  return { type: PRODUCTS_LOADING, query };
}

function setLoadSuccess(data) {
  return { type: PRODUCTS_LOAD_SUCCESS, data };
}

function setLoadError(error) {
  return { type: PRODUCTS_LOAD_ERROR, error };
}

export function loadProducts(query) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(query));

      apiFetch('api/products/', { query })
        .then((data) => {
          dispatch(setLoadSuccess(data));
          resolve();
        })
        .catch((error) => {
          dispatch(setLoadError(error));
          resolve();
        });
    });
  };
}
