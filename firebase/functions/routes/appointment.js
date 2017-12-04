const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const isAuthenticated = require('../middleware/isAuthenticated.js');

/**
 *  Admin
 *  @api {get} /appointments/ Get All Appointments
 *  @apiName Returns all appointments
 *  @apiGroup Appointments
 *
 *  @apiSuccess {Array} appointments List of appointments
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/appointments/', (req, res) => {
	db.collection("appointments").get()
	.then((snapshot) => {
		let appointments = [];
		snapshot.forEach((doc) => {
			appointments.push(doc.data());
		});
		res.send(appointments);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

/**
 *  Admin
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
router.post('/appointments/:timeSlotId', (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const appointment = req.body;
	const timeSlotId = req.params.timeSlotId;
	// check timeSlotId
	if (!validator.isAscii(appointment.comment)
	) {
		return res.status(400).send("Input validation failed.");
	}
	appointment.canceled = false;
	// appointment.reservedBy = admin.firestore().collection("users").doc(user);
	appointment.timeslot = admin.firestore().collection("timeslots").doc(timeSlotId);
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
	if (req.user.uid !== req.params.id) {
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

module.exports = router;