import { USER_SIGN_IN, USER_SIGN_OUT } from 'actions/user';

const initialState = {
  logged_in: false,
  role: 'guest',
  data: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_SIGN_IN: {
      const newState = { ...initialState };
      newState.data = { ...action.data };
      newState.role = action.data.role;
      newState.logged_in = true;

      return newState;
    }

    case USER_SIGN_OUT: {
      const newState = { ...initialState };
      newState.data = { ...initialState.data };
      newState.role = 'guest';
      newState.logged_in = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
