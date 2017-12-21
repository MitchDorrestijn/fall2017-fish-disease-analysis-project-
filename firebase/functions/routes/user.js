const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const isAuthenticated = require('../middleware/isAuthenticated.js');
const db = admin.firestore();
const mailer = require('../mailer/mailer.js');
const Joi = require('joi');
const validate = require('../middleware/validate.js');

const model = {
	schema: {
		update: Joi.object().keys({
			firstName: Joi.string().alphanum().min(3), 
			lastName: Joi.string().alphanum().min(3),
			country: Joi.string().alphanum(),
			password: Joi.string().min(6).allow('').optional(),
			birthDate: Joi.date()
		})
	}
}

const getUser = (req, res) => {
	db.collection('users').doc(req.user.uid).get().then(profile => {
		if (profile.empty) {
			return res.status(400).send('User not found');
		}
		return res.send(profile.data());
	}).catch(error => {
		res.status(500).send(error.message);
	});
}

const updateUser = (req, res) => {
	const user = req.body.user;
	const userId = req.user.uid;

	// If password is given, place a promise at the start to first edit the password.
	let promise = new Promise((resolve, reject) => {
		resolve();
	});

	if (user.password) {
		promise = admin.auth().updateUser(userId, {
			password: user.password,
		})
	}

	promise.then(() => {
		return db.collection('users').doc(userId).update({
			firstName: user.firstName,
			lastName: user.lastName,
			country: user.country,
			birthDate: user.birthDate,
		});
	}).then(() => {
		res.sendStatus(200);
	}).catch((error) => {
		res.status(500).send(error.message);
	});
}

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
router.get('/users/:id/', isAuthenticated, getUser);
router.get('/me', isAuthenticated, getUser);

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
router.put('/users/:id', isAuthenticated, validate('user', model.schema.update), updateUser);
router.put('/me', isAuthenticated, validate('user', model.schema.update), updateUser);

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