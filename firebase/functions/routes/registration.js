const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');

const db = admin.firestore();

// route for a user to register.
router.post('/register/', function (req, res) {
    if(!req.body.user){
        return res.sendStatus(400);
	}

	const user = req.body.user;
	
	// if(	//!validator.isEmail(user.email) || 
	// 	//!validator.isAlpha(user.firstName) ||
	// 	//!validator.isAlpha(user.lastName) ||
	// 	//!validator.isAlpha(user.country) ||
	// 	validator.isEmpty(user.password)
	// ){
	// 	return res.status(400).send("Input validation failed");
	// }

    admin.auth().createUser({
        email: user.email,
        emailVerified: false,
        password: user.password,
        displayName: user.firstName + " " + user.lastName,
        disabled: false
    }).then(function(creationResult){
		if(creationResult){

			// Alter input data for privacy reasons
			user.id = creationResult.uid;
			delete user.password;

			// Create user in database
			db.collection("users").doc(creationResult.uid).set(user).then(function(result){

				// If succeeded == there is a result
				if(result) {
					return res.sendStatus(201);
				}
				return res.sendStatus(500);
			});
		} else {
			return res.sendStatus(500);
		}
	});
})

const validateEmail = function(email){
	return true;
}

module.exports = router