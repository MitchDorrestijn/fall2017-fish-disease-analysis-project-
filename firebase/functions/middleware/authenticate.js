const admin = require("firebase-admin");

// This function adds to user information to req.user. When a request comes in with a valid idToken, 
// the req.user is automatically populated with it.

module.exports = function(req, res, next){
    // When there is no header given, continue
    if(!req.headers.idtoken){
        next();
        return;
    }

    // Decode idToken
    admin.auth().verifyIdToken(req.headers.idtoken)
    .then(function(decodedToken) {
        const uid = decodedToken.uid;
        admin.auth().getUser(uid)
        .then(function(userRecord) {
            req.user = userRecord;
            next();
        })
        .catch(function(error) {
            next();
        });
    }).catch(function(error) {
        // Not a valid idToken
        next();
    });
}