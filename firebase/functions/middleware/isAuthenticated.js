module.exports = isAuthenticated = (req, res, next) => {
    
    // Checks whether the authentication middleware is succesfully detected and parsed an idToken.
    if (req.user)
        return next();

    // When not, send the appropriate status code.
    res.status(403).send("Unauthorized");
};