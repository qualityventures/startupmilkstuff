import apiFetch from 'helpers/api-fetch';

export const PRODUCT_LOADING = 'product:loading';
export const PRODUCT_LOAD_SUCCESS = 'product:load_success';
export const PRODUCT_LOAD_ERROR = 'product:load_error';

function setLoading(url) {
  return { type: PRODUCT_LOADING, url };
}

function setLoadSuccess(data) {
  return { type: PRODUCT_LOAD_SUCCESS, data };
}

function setLoadError(error) {
  return { type: PRODUCT_LOAD_ERROR, error };
}

export function loadProduct(url) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(url));

      apiFetch(`api/products/getByUrl/${url}`)
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
