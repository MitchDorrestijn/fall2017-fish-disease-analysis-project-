const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const isAuthenticated = require('../middleware/isAuthenticated.js');

/**
 *  @api {get} /appointments/ Get All Appointments
 *  @apiName Returns all appointments of current logged in user
 *  @apiGroup Appointments
 *
 *  @apiSuccess {Array} appointments List of appointments
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/appointments/', isAuthenticated, (req, res) => {
	db.collection("appointments").where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		let appointments = [];
		snapshot.forEach((doc) => {
			appointments.push(doc.data());
		});
		for (let i = 0; i < appointments.length; i++) {
			delete appointments[i].user;
		}
		res.send(appointments);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

/**
 *  @api {POST} /appointments/:id Make an appointment
 *  @apiName create an appointment
 *  @apiGroup Appointments
 *
 *  @apiUse HTTPCreated
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 *  @apiUse BadRequest
 */
router.post('/appointments/',isAuthenticated, (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const appointment = req.body;
	if (!validator.isAscii(appointment.comment) ||
		!validator.isISO8601(appointment.date)
	) {
		return res.status(400).send("Input validation failed.");
	}
	appointment.date = new Date(appointment.date);
	if (appointment.date <= new Date(new Date().setDate(new Date().getDate() + 7))) {
		return res.status(400).send('Appointment date should be more then 7 days away');
	}
	appointment.canceled = false;
	appointment.user = admin.firestore().collection("users").doc(user);
	// appointment.user = req.user.uid;
	db.collection('appointments')
	.add(appointment)
	.then((newDoc) => {
		return newDoc.get()
	})
	.then((document) => {
		res.status(201).send();
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

/**
 *  @api {PUT} /appointment/:id Cancel appointment
 *  @apiName Change open appointment to canceled
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment updated
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 */
router.put('/appointments/:id', isAuthenticated, (req, res) => {
	if (req.user.uid !== req.params.id){
		return res.sendStatus(403);
	}
	const appointmentId = req.params.id;
	const appointmentRef = db.collection('appointments').doc(appointmentId);
	return appointmentRef.update({
		canceled: true
	})
	.then(() => {
		res.sendStatus(204);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

/**
 *  @api {DELETE} /appointment/:id Delete appointment
 *  @apiName Remove an appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment deleted
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.delete('/appointments/:id',isAuthenticated, (req, res) => {
	const appointmentId = req.params.id;
	db.collection('appointments').doc(appointmentId).delete()
	.then(() => {
		res.status(204).send('Appointment deleted');
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

module.exports = router;