import { TOKEN_SET, TOKEN_CLEAN } from 'actions/token';
import { setCookie, removeCookie } from 'helpers/cookie';

const initialState = '';

export default function (state = initialState, action) {
  switch (action.type) {
    case TOKEN_SET: {
      setCookie('auth_jwt', action.token, 86400 * 30);
      return action.token;
    }

    case TOKEN_CLEAN: {
      removeCookie('auth_jwt');
      return '';
    }

    default: {
      return state;
    }
  }
}
