/**
 * @apiDefine APIUnauthorizedError
 *
 * @apiError unauthorized_access Unauthorized access
 */

export function throwUnauthorizedAccess(res) {
  res.status(401);
  res.json({ error: 'unauthorized_access' });
}

/**
 * @apiDefine APIUnknownErrors
 *
 * @apiError unknown_error An unknown error has occured
 */

export function throwInternalServerError(res) {
  res.status(500);
  res.json({ error: 'unknown_error' });
}

export function returnObjectAsJSON(res, object) {
  res.status(200);
  res.json(object);
}

export function throwErrorWithStatusCode(res, error, statusCode) {
  res.status(statusCode);
  res.json({ error });
}

export function throwError(res, error) {
  res.status(400);
  res.json({ error });
}

export function returnOkWithoutBody(res) {
  res.status(200);
  res.json(null);
}
