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
	userRef.get().then(profileObject => {
		if (profileObject.empty) {
			return Promise.reject(
				new Error('Aquarium non existent or not owned by user.'));
		}
		return res.send(profileObject.data()).status(200);
	}).catch(err => {
		res.send(err.message).status(400);
	});
});
/**
 * Update profile of user from id
 */
router.post('/user/:id/', (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const user = req.body;
	if (!validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isISO8601(user.birthDate)
	) {
		return res.status(400).send('input validation failed');
	}
	const userId = req.params.id;
	// If password is given, user auth settings and user account settings are set after each other,
	// otherwise only set account settings
	if (user.password.length !== 0) {
		admin.auth().updateUser(userId, {
			password: user.password,
		}).then((authUser) => {
			const userRef = db.collection('users').doc(userId);
			return userRef.update({
				firstName: user.firstName,
				lastName: user.lastName,
				country: user.country,
				birthDate: user.birthDate,
			});
		}).then((user) => {
			res.send('User updated').status(200);
		}).catch((error) => {
			res.status(400).send(error.message);
		});
	} else {
		const userRef = db.collection('users').doc(userId);
		return userRef.update({
			firstName: user.firstName,
			lastName: user.lastName,
			country: user.country,
			birthDate: user.birthDate,
		}).then((user) => {
			res.send('User updated').status(200);
		}).catch((error) => {
			res.status(400).send(error.message);
		});
	}
});

module.exports = router;