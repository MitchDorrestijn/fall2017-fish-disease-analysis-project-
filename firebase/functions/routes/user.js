const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
// define the home page route
router.get('/user/:id/', function (req, res) {
	const userId = req.params.id;
	const userRef = db.collection('users').doc(userId);
	userRef.get().then( profileObject => {
		res.send(profileObject.data()).status(200);
	}).catch(err => {
		res.send('Error').status(400);
	});
});

router.post('user', function (req,res) {
	if(!req.body.user){
		return res.sendStatus(400);
	}
	const user = req.body.user;

	if(	!validator.isEmail(user.email) ||
		!validator.isAlpha(user.firstName) ||
		!validator.isAlpha(user.lastName) ||
		!validator.isAlpha(user.country) ||
		validator.isEmpty(user.password)
	){
		return res.status(400).send("Input validation failed.");
	}
});
// define the about route
router.get('/user/other/', function (req, res) {
	res.send('Other user page');
});

module.exports = router;