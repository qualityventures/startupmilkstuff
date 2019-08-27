export const TOKEN_SET = 'TOKEN_SET';
export const TOKEN_CLEAN = 'TOKEN_CLEAN';

export function tokenSet(token) {
  return { type: TOKEN_SET, token };
}

export function tokenClean() {
  return { type: TOKEN_CLEAN };
}
