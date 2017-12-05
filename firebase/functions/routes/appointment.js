const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const isAuthenticated = require('../middleware/isAuthenticated.js');
const helperFunctions = require('../middleware/functions.js');
/**
 *  Admin
 *  @api {get} /appointments/ Get All Appointments
 *  @apiName Returns all appointments
 *  @apiGroup Appointments
 *
 *  @apiSuccess {Array} appointments List of appointments
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  TODO: maybe it could be made more efficient?
 */
router.get('/appointments/',isAuthenticated, (req, res) => {
	db.collection("appointments").get()
	.then((snapshot) => {
		let appointments = [];
		snapshot.forEach((doc) => {
			appointments.push(helperFunctions.flatData(doc));
		});
		return appointments;
	}).then((appointmentsWithId) => {
		let appointments = appointmentsWithId;
		let promises = [];
		appointmentsWithId.forEach((appointment) => {
			promises.push(admin.auth().getUser(appointment.reservedBy).then((userRecord) => {
				appointment.reservedBy = userRecord.toJSON().displayName;
				return appointment;
			}))
		});
		Promise.all(promises).then(() => {
			res.send(appointments);
		});
	})
	.catch((err) => {
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
	appointment.approved = false;
	appointment.video = false;
	appointment.reservedBy = admin.firestore().collection("users").doc(req.user.uid);
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
	const appointment = req.body;
	const appointmentId = req.params.id;
	const appointmentRef = db.collection('appointments').doc(appointmentId);

	if (appointment.approved) {
		appointment.approved = false;
	}
	if (appointment.video) {
		appointment.video = false;
	}
	if (appointment.canceled) {
		appointment.canceled = false;
	}

	return appointmentRef.update({
		approved: appointment.approved,
		canceled: appointment.canceled,
		video: appointment.video
	})
	.then(() => {
		res.sendStatus(204);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

module.exports = router;