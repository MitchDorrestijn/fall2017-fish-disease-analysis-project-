const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const google = require('googleapis');
const db = admin.firestore();

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const isAdmin = require('../middleware/isAdmin.js');
const validateModel = require('../middleware/validateModel.js');

router.get("/notifications", isAuthenticated, (req, res) => {
    db.collection("notifications").where("user", "==", req.user.ref).orderBy('date', 'desc').get()
    .then((snapshot) => {
        var notifications = []
        snapshot.forEach((doc) => {
            notifications.push(doc.data());
        })
        res.send(notifications);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(error.message);
    })
})

/**
 *  @api {get} /notifications/rules Get all Notification Rules
 *  @apiName Gets all rules
 *  @apiGroup Notifications
 *
 *  @apiSuccess {Array} Notification Rules
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/notifications/rules', isAdmin, (req, res) => {
    db.collection('notification_rules').get()
    .then((snapshot) => {
        let arr = []
        snapshot.docs.forEach((doc) => {
            arr.push(doc.data())
        })
        res.status(200).send(arr);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

/**
 *  @api {post} /notifications/rules Create Notification Rule
 *  @apiName Creates rule used when values of an aquarium are imported.
 *  @apiGroup Notifications
 *
 *  @apiSuccess {Object} Notification Rule
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.post('/notifications/rules', isAdmin, validateModel("rule", ["message", "compared", "min", "max", "equation", "attribute"]), (req, res) => {
    db.collection('notification_rules').add(req.body.rule)
    .then((newObject) => {
        return newObject.get();
    })
    .then((doc) => {
        res.status(201).send(doc.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.put('/notifications/rules/:id', isAdmin, validateModel("rule", ["message", "compared", "min", "max", "equation", "attribute", "id"]), (req, res) => {
    db.collection('notification_rules').doc(req.params.id).update(req.body.rule)
    .then((doc) => {
        res.status(200).send("Ok");
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.delete('/notifications/rules/:id', isAdmin, (req, res) => {
    db.collection('notification_rules').doc(req.params.id).delete()
    .then(() => {
        res.status(200).send();
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

// Route for getting an API token from google. Currently not necessary.
router.get('/notifications/access_token', (req, res) => {
    var key = require('../private-key.json');
    var jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        "https://www.googleapis.com/auth/firebase.messaging",
        null
    );
    jwtClient.authorize(function(err, tokens) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(tokens.access_token);
    });
})

// Push a message to device
router.post('/notifications/push/:token', (req, res) => {
    const payload = {
        notification: {
            title: "Test vanuit de server",
            body: "Wat mooi zeg!"
        }
    }
    admin.messaging().sendToDevice(req.params.token, payload)
    .then(function(response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        res.send(response);
    })
    .catch(function(error) {
        res.send("Error sending message: ", error.message);
    });
});

// Add a device to the current authenticated user.
router.post('/notifications/push/register', isAuthenticated, validateModel('token', ['token', 'browser']), (req, res) => {
    // if(!req.body.token){
    //     return res.send(400).send("Please provide a token to register: { token: xxxx, devices: 'browser' }");
    // }

    db.collection('users').doc(req.user.id).collection('devices').add(req.body.token)
    .then((addedDoc) => {
        res.status(201).send(addedDoc.data());
    })
    .catch((error) => {
        res.status(500).send(error);
    })
})

module.exports = router;
