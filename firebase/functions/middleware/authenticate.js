const admin = require("firebase-admin");

// This function adds to user information to req.user. When a request comes in with a valid idToken, 
// the req.user is automatically populated with it.

module.exports = (req, res, next) => {
    // When there is no header given, continue
    if (!req.headers.authorization){
        next();
        return;
    }

    // Decode idToken
    const token = req.headers.authorization.split(" ")[1];
    if (!token){
        next();
        return;
    }

    admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
        const uid = decodedToken.uid;
        admin.auth().getUser(uid)
        .then((userRecord) => {
            req.user = userRecord;
            req.user.ref = admin.firestore().collection("users").doc(req.user.uid);
            return req.user.ref.get()
        })
        .then((document) => {
            if(document.data().isAdmin === true){
                req.user.isAdmin = true;
            }
            next();
        })
        .catch((error) => {
            next();
        });
    })
    .catch((error) => {
        // Not a valid idToken
        console.log(error);
        next();
    });
};