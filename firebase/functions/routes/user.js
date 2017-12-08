const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');
const isAuthenticated = require('../middleware/isAuthenticated.js');
const db = admin.firestore();
const mailer = require('../mailer/mailer.js');

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
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 */
router.get('/users/:id/', isAuthenticated, (req, res) => {
	// Check if user is indeed authenticated user
	if (req.user.uid !== req.params.id){
		return res.sendStatus(403);
	}
	const userId = req.params.id;
	const userRef = db.collection('users').doc(userId);
	userRef.get().then(profileObject => {
		if (profileObject.empty) {
			return Promise.reject(
				new Error('User does not exist.'));
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
*  @apiUse BadRequest
*  @apiUse InternalServerError
*  @apiUse UserAuthenticated
*  @apiUse Forbidden
*/
router.put('/users/:id/', isAuthenticated, (req, res) => {
	// Check if user is indeed authenticated user
	if (req.user.uid != req.params.id){
		return res.status(403).send("User is trying to access other user's credentials.");
	}
	if (!req.body) {
		return res.status(400).send("No body provided");
	}
	const user = req.body;
	if (!validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isISO8601(user.birthDate) ||
		!validator.isISO31661Alpha2(user.country)
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

// Route to test mailer.
router.post('/user/mail', (req, res) => {
	mailer.mail("jaapweijland@gmail.com", "Title", "Body")
	.then(() => {
		res.sendStatus(200);
	})
	.catch((error) => {
		res.send(error.message);
	})
})

module.exports = router;