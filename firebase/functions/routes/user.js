const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');

const db = admin.firestore();

/**
 * Get profile of user from id
 */
router.get('/user/:id/', (req, res) => {
	const userId = req.params.id;
	const userRef = db.collection('users').doc(userId);
	userRef.get().then( profileObject => {
		if (profileObject.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		console.log(profileObject.data());
		return res.send(profileObject.data()).status(200);
	}).catch(err => {
		res.send(err).status(400);
	});
});
/**
 * Update profile of user from id
 */
router.post('/user/:id/', (req,res) => {
	const userId = req.params.id;
	if(!req.body){
		return res.sendStatus(400);
	}
	const user = req.body;

	// TODO: validate date
	if( !validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isAlpha(user.country)
	){
		return res.status(400).send("Input validation failed.");
	}
	const userRef = db.collection('users').doc(userId);
	console.log(userRef);
	userRef.update({
		firstName: user.firstName,
		lastName: user.lastName,
		country: user.country
	}).then((user) => {
		res.send('User updated').status(200);
	}).catch((error) => {
		console.log(error);
		res.status(400).send('Error');
	});
	// admin.auth().updateUser(userId, {
	//
	//
});

module.exports = router;