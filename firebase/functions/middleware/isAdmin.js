module.exports = isAdmin = (req, res, next) => {
    
    // Checks whether the authentication middleware is successfully detected and parsed an idToken.
    if (req.user.isAdmin)
        return next();

    // When not, send the appropriate status code.
    res.status(403).send("Unauthorized, must be admin to perform this request.");
};