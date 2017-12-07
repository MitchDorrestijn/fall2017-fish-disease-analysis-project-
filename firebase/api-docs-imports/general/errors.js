/**
 * @apiDefine InternalServerError
 * @apiError InternalServerError The server had an internal error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Custom Error"
 *     }
 */

/** @apiDefine UnprocessableEntity
 *  @apiError Unprocessable Entity Server was unable to process the contained instructions
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity Error
 *     {
 *          Unprocessable Entity
 *     }
 */

/** @apiDefine Forbidden
 *  @apiError The server understood the request but refuses to authorize it
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *          Forbidden
 *     }
 */

/**
 * @apiDefine BadRequest
 * @apiError The Request cannot be understood
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 */

/**
 * @apiDefine ValidationError
 * @apiError Input validation failed
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       Input validation failed.
 *     }
 */