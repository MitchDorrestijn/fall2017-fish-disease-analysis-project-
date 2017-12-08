/**
 * @apiDefine UserAuthenticated
 * @apiHeader {String} Authorisation Users unique token.
 * @apiError UserNotFound the authentication middleware did not successfully detect and parse an idToken
 *
 */
module.exports = isAuthenticated = (req, res, next) => {
    // Checks whether the authentication middleware is successfully detected and parsed an idToken.
    if (req.user)
        return next();
    console.log("not authed");
    // When not, send the appropriate status code.
    res.status(403).send("Unauthorized");
};