const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');
const path = require('path');
const hasher = require ('node-hasher');

// Custom dependencies
const mailer = require('../mailer/mailer.js');

const db = admin.firestore();

// route for a user to register.
router.post('/register/', function (req, res) {
	// if no input, then return 400.
    if(!req.body.user){
		return res.sendStatus(400);
	}

	const user = req.body.user;
	console.log("register");
	
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
			user.verificationToken = hasher('md5', user.id);
			console.log(user.verificationToken);
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
		console.log(result);
		if(result) {
			// TODO: Send email verification
			console.log("mailing");
			sendWelcomeMail(user);
			res.send({user: user}).status(201);
			return;
		}
		res.sendStatus(500);
	})
})

const sendWelcomeMail = (user) => {
	mailer.mail(user.email, "Welcome to Bassleer.nl!", "Welcome to Bassleer! We hope your fish get well fast!<br /><br /><a href='https://bassleer.nl/api/verify/" + user.id + "/" + user.verificationToken + "'>Please verify your emailaddress by click on this link.</a>");
}

// VERIFICATION MAILER

router.get('/verify/:id/:token', (req, res) => {
	const id = req.params.id;
	const token = req.params.token;

	admin.auth().getUser(id)
	.then(() => {
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
	.then(() => {
		return db.collection("users").doc(id).update({
			verificationToken: admin.firestore.FieldValue.delete()
		})
	})
	.then(() => {
		return res.redirect('/?verification=success');
	})
	.catch((error) => {
		return res.status(400).send(error.message);
  	})
});

router.get('/mailtest', (req, res) => {
	mailer.testMail("","","");
})

router.get('/mail', (req, res) => {
	mailer.mail("coen_severein@hotmail.com","Hoi","Content");
	res.sendStatus(200);
})

module.exports = router