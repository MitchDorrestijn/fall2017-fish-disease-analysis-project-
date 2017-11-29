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
router.post('/register/', (req, res) => {
	// if no input, then return 400.
    if (!req.body.user){
		return res.sendStatus(400);
	}

	const user = req.body.user;
	
	// Validate input
	// TODO: country needs to be validated
	if (!validator.isEmail(user.email) ||
		!validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isISO31661Alpha2(user.country) ||
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
	.then((creationResult) => {
		if (creationResult){
			// Alter input data for privacy reasons
			user.id = creationResult.uid;
			user.verificationToken = hasher('md5', user.id + Date.now());
			delete user.password;
	
			// Create user in database
			return db.collection("users").doc(creationResult.uid).set(user);
		} else {
			res.sendStatus(500);
			return Promise.reject('Internal error.');
		}
	})
	.then((result) => {
		// If succeeded == there is a result
		if (result) {
			sendWelcomeMail(user);
			res.status(201).send({user: user});
			return;
		}
		res.sendStatus(500);
	}).catch((error) => {
		res.status(500).send(error.message);
	});
});

router.delete('/user/:id', (req, res) => {
	if (req.user.uid !== req.params.id) {
		return res.status(401).send("Unauthorized");
	}
	admin.auth().deleteUser(req.user.uid)
	.then(() => {
	  	res.sendStatus(204);
	})
	.catch((error) => {
	  	res.status(500).send(error.message);
	});
});

const sendWelcomeMail = (user) => {
	mailer.mail(user.email, "Welcome to Bassleer.nl!", "Welcome to Bassleer! We hope your fish get well fast!<br /><br /><a href='https://bassleer.nl/api/verify/" + user.id + "/" + user.verificationToken + "'>Please verify your emailaddress by click on this link.</a>");
};

// VERIFICATION MAILER

router.get('/verify/:id/:token', (req, res) => {
	const id = req.params.id;
	const token = req.params.token;

	admin.auth().getUser(id)
	.then(() => {
		return db.collection("users").where("id", "==", id).where("verificationToken", "==", token).get();
	})
	.then((snapshot) => {
		if (snapshot.size == 0){
			throw new Error("Token incorrect.");
		}
		return admin.auth().updateUser(id, {
			emailVerified: true,
		});
	})
	.then(() => {
		return db.collection("users").doc(id).update({
			verificationToken: admin.firestore.FieldValue.delete()
		});
	})
	.then(() => {
		return res.redirect('/?verification=success');
	})
	.catch((error) => {
		return res.status(400).send(error.message);
  	});
});

router.post('/forgot-password', (req, res) => {
	const email = req.body.email;
	if (!validator.isEmail(email)){
		return res.status(400).send("Invalid email");
	}
	let passwordForgotToken;
	admin.auth().getUserByEmail(email).then((user)=>{
		passwordForgotToken = hasher('md5', email + Date.now());
		return db.collection("users").doc(user.uid).update({ passwordForgotToken: passwordForgotToken });
	}).then(()=>{
		return mailer.mail(email, "Forgot password?",
		"Hi there! We heard you forgot your password.<br/><br/><a href='https://bassleer.nl/forgot-password/" + passwordForgotToken + "'>Please click here to reset it.</a>"
		);
	}).then(() => {
		res.status(200).send("Mail sent");
	}).catch((error)=>{
		console.log(error);
		res.status(500).send("Email does not exist");
	});
});

router.post('/forgot-password/:token', (req, res) => {
	const password = req.body.password;

	if (req.body.password === null || validator.isEmpty(password) || validator.isEmpty(req.params.token)) {
		return res.sendStatus(400);
	}

	let passwordForgotToken;
	let user;

	db.collection("users").where("passwordForgotToken", "==", req.params.token).get()
	.then((snapshot) => {
		if (snapshot.size == 0){
			return Promise.reject(new Error("Token incorrect."));
		}
		user = snapshot.docs[0];
		return admin.auth().updateUser(user.id, {
			password: password
		});
	}).then(() => {
		return db.collection("users").doc(user.id).update({
			passwordForgotToken: admin.firestore.FieldValue.delete()
		});
	}).then(() => {
		res.send(200);
	}).catch((error) => {
		res.status(500).send(error.message);
	});
});

module.exports = router;
