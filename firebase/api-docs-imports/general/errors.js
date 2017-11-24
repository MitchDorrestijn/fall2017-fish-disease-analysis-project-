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
