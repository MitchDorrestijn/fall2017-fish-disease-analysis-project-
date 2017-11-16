const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');
var path = require('path');

const db = admin.firestore();

// route for a user to register.
router.post('/register/', function (req, res) {
	// if no input, then return 400.
    if(!req.body.user){
		return res.sendStatus(400);
	}

	const user = req.body.user;
	
	// Validate input
	if(	!validator.isEmail(user.email) || 
		!validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isAlpha(user.country) ||
		validator.isEmpty(user.password)
	){
		return res.status(400).send("Input validation failed.");
	}

    admin.auth().createUser({
        email: user.email,
        emailVerified: false,
        password: user.password,
        displayName: user.firstName + " " + user.lastName,
        disabled: false
	})
	.then(function(creationResult){
		if(creationResult){
			// Alter input data for privacy reasons
			user.id = creationResult.uid;
			delete user.password;
	
			// Create user in database
			return db.collection("users").doc(creationResult.uid).set(user)
		} else {
			res.sendStatus(500);
			Promise.reject('Internal error.');
		}
	})
	.then((result) => {
		// If succeeded == there is a result
		if(result) {
			// TODO: Send email verification
			res.send({user: user}).status(201);
		}
		res.sendStatus(500);
	})
})

// VERIFICATION MAILER

router.get('/verify/:id/:token', (req, res) => {
	const id = req.params.id;
	const token = req.params.token;

	admin.auth().getUser(id)
	.then((userRecord) => {
		return db.collection("users").where("id", "==", id).where("verificationToken", "==", token).get();
	})
	.then((snapshot) => {
		if(snapshot.size == 0){
			throw new Error("Token incorrect.");
			return;
		}
		snapshot.forEach((doc) => {
			return admin.auth().updateUser(id, {
				emailVerified: true,
			});
		})
	})
	.then((result) => {
		return db.collection("users").doc(id).update({
			verificationToken: admin.firestore.FieldValue.delete()
		})
	})
	.catch((error) => {
		return res.status(400).send(error.message);
  	})
	.then((result) => {
		return res.redirect('/?verification=success');
	})
});

module.exports = router