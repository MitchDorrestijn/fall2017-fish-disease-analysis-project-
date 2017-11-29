const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');
const isAuthenticated = require('../middleware/isAuthenticated.js');

const db = admin.firestore();

/**
 *  @api {get} /users/:id/ Get user
 *  @apiName Returns profile data of a user
 *  @apiGroup Users
 *
 *  @apiSuccess {Object} User profile object
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        name: 'John',
		surname: 'Doe',
		email: 'test@test.nl',
		country: 'The Netherlands',
		birthDate: '1999-01-01T00:00:00.000Z'
 *  }
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated //TODO: Still needs to be implemented
 */
router.get('/users/:id/', (req, res) => {
	const userId = req.params.id;
	const userRef = db.collection('users').doc(userId);
	userRef.get().then(profileObject => {
		if (profileObject.empty) {
			return Promise.reject(
				new Error('Aquarium non existent or not owned by user.'));
		}
		return res.send(profileObject.data()).status(200);
	}).catch(err => {
		res.status(400).send(err.message);
	});
});

/**
*  @api {get} /users/:id/ Update user
*  @apiName Update profile of user from id
*  @apiGroup Users
*
*  @apiSuccess {String} User updated
*  @apiSuccessExample Success-Response:
*  HTTP/1.1 200 OK
*  {
*       User updated
*  }
*  @apiUse InternalServerError
*  @apiUse UserAuthenticated // TODO: Still needs to be implemented
*/
router.post('/users/:id/', (req, res) => {
	if (req.user.uid !== req.params.id){
		return res.sendStatus(403);
	}
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
			return db.collection('users').doc(userId).update({
				firstName: user.firstName,
				lastName: user.lastName,
				country: user.country,
				birthDate: user.birthDate,
			});
		}).then((user) => {
			res.send('User updated');
		}).catch((error) => {
			res.status(500).send(error.message);
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
			res.status(500).send(error.message);
		});
	}
});

module.exports = router;