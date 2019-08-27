export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';

export function userSignIn(data) {
  return { type: USER_SIGN_IN, data };
}

export function userSignOut() {
  return { type: USER_SIGN_OUT };
}
