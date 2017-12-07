const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const mailer = require('../mailer/mailer.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');

/* Helper functions */
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
 *  @apiUse AppointmentSuccess
 */
// TODO: maybe it could be made more efficient?
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
 *  @api {get} /appointments/ Get appointments of user
 *  @apiName Returns all appointments of user
 *  @apiGroup Appointments
 *
 *  @apiSuccess {Array} appointments List of appointments
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse AppointmentSuccess
 */
router.get('/appointments/user/:id',isAuthenticated, (req, res) => {
	if (req.user.uid !== req.params.id){
		return res.sendStatus(403);
	}
	db.collection("appointments").where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		let appointments = [];
		snapshot.forEach((doc) => {
			appointments.push(helperFunctions.flatData(doc));
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
router.post('/appointments/',isAuthenticated,validateModel("appointment",["comment","timeSlotId"]), (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const appointmentBody = req.body.appointment;
	// check timeSlotId
	if (!validator.isAscii(appointmentBody.comment)
	) {
		return res.status(400).send("Input validation failed.");
	}
	const appointment = {};
	appointment.comment = appointmentBody.comment;
	appointment.canceled = false;
	appointment.approved = false;
	appointment.reservedBy = admin.firestore().collection("users").doc(req.user.uid);
	appointment.timeslot = admin.firestore().collection("timeslots").doc(appointmentBody.timeSlotId);
	admin.auth().getUser(req.user.uid).then((userRecord) => {
		sendNewAppointmentMail(userRecord);
	});
	// At the moment a static user id which is the consultant, if we decide to let the user chose a consultant we can get the consultant
	admin.auth().getUser("kXKvHb3WlYWIQu3LxUzyYZVuFHt2").then((userRecord) => {
		sendConsultNewAppointmentMail(userRecord);
	});
	db.collection('appointments')
	.add(appointment)
	.then(() => {
		res.status(201).send();
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

/**
 *  @api {PUT} /appointment/:id updating appointment
 *  @apiName Update a appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment updated
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 */
router.put('/appointments/:appointmentId/',isAuthenticated, (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const appointment = req.body.appointment;
	const appointmentId = req.params.appointmentId;
	const appointmentRef = db.collection('appointments').doc(appointmentId);
	let consultant = null;
	if (appointment.consultantId) {
		consultant = db.collection('users').doc(appointment.consultantId);
	}
	return appointmentRef.update({
		approved: appointment.approved,
		canceled: appointment.canceled,
		video: appointment.video,
		consultant: consultant
	})
	.then(() => {
		res.sendStatus(204);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

/**
 *  @api {PUT} /appointment/:id updating appointment
 *  @apiName Update a appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment updated
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 */
router.put('/appointments/:appointmentId/users/:userId',isAuthenticated, (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const appointment = req.body.appointment;
	const appointmentId = req.params.appointmentId;
	const appointmentRef = db.collection('appointments').doc(appointmentId);
	let consultant = null;
	if (appointment.consultantId) {
		consultant = db.collection('users').doc(appointment.consultantId);
	}
	if (appointment.approved) {
		admin.auth().getUser(req.params.userId).then((userRecord) => {
			sendAppointmentApprovedMail(userRecord);
		});
	}
	return appointmentRef.update({
		approved: appointment.approved,
		canceled: appointment.canceled,
		video: appointment.video,
		consultant: consultant
	})
	.then(() => {
		res.sendStatus(204);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

const sendNewAppointmentMail = (user) => {
	mailer.mail(user.email, "Appointment Bassleer", "Hello, We are sending you this email to confirm that you have requested an appointment with a consultant of Bassleer.");
};

const sendAppointmentApprovedMail = (user) => {
	mailer.mail(user.email, "Appointment approved Bassleer", "Hello, We are sending you this email to confirm that you have made an appointment with a consultant.");
};

const sendConsultNewAppointmentMail = (user) => {
	mailer.mail(user.email, "New Appointment", "Hallo, een gebruiker heeft een aanvraag gedaan voor een afspraak.");
};

module.exports = router;