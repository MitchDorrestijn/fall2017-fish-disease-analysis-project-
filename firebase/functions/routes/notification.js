const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');

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

module.exports = router;
