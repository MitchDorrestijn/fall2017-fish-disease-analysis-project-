const admin = require("firebase-admin");

// This function adds to user information to req.user. When a request comes in with a valid idToken, 
// the req.user is automatically populated with it.

module.exports = function(req, res, next){
    // When there is no header given, continue
    if(!req.headers.authorization){
        next();
        return;
    }

    // Decode idToken
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        next();
        return;
    }

    admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
        const uid = decodedToken.uid;
        admin.auth().getUser(uid)
        .then(function(userRecord) {
            req.user = userRecord;

            // The following is used to save the reference for easy querying and editing
            req.user.ref = admin.firestore().collection("users").doc(req.user.uid);
            next();
        })
        .catch(function(error) {
            next();
        });
    }).catch(function(error) {
        // Not a valid idToken
        console.log(error);
        next();
    });
}