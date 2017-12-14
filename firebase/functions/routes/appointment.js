const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const mailer = require('../mailer/mailer.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');
const isAdmin = require('../middleware/isAdmin.js');

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
router.get('/admin/appointments/', (req, res) => {
	db.collection("appointments").get().then((snapshot) => {
		let appointments = [];
		let promises = [];
		snapshot.forEach((doc) => {
			let appointmentFlat = helperFunctions.flatData(doc);
			if (appointmentFlat.timeslotId) {
				promises.push(
					db.collection('timeslots').doc(appointmentFlat.timeslotId).get()
					.then((timeslot) => {
						appointmentFlat.timeslot = helperFunctions.flatData(timeslot);
						appointments.push(appointmentFlat);
						return null;
					})
				)
			}
		});
		Promise.all(promises).then(() => {
			return appointments;
		}).then((appointmentsWithId) => {
			let appointments = appointmentsWithId;
			let promises = [];
			appointmentsWithId.forEach((appointment) => {
			  	let userId = appointment.reservedBy;
				promises.push(admin.auth().
					getUser(appointment.reservedBy).
					then((userRecord) => {
				  		appointment.reservedById = userId;
						appointment.reservedBy = userRecord.toJSON().displayName;
						return appointment;
					}));
			});
			Promise.all(promises).then(() => {
				res.send(appointments);
			});
		}).catch((err) => {
			res.status(500).send(err.message);
		});
	});
});

/**
 *  @api {DELETE} /appointment/:id Cancel appointment
 *  @apiName cancel an appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment canceled
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.delete('/appointments/:id',isAuthenticated, (req, res) => {
	const appointmentId = req.params.id;
	const appointment = db.collection('appointments').doc(appointmentId);
	db.collection('appointments').doc(appointmentId).update({
		canceled: true
	})
	.then(() => {
		appointment.get().then((snapshot) => {
			admin.auth().getUser(helperFunctions.flatData(snapshot).reservedBy).then((userRecord) => {
				sendAppointmentCanceledMail(userRecord);
				res.status(204).send('Appointment canceled');
			});
		});
	})
	.catch((error) => {
		res.status(500).send(error.message);
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
router.get('/appointments/', isAuthenticated, (req, res) => {
	db.collection("appointments").where("reservedBy", "==", req.user.ref).get()
	.then((snapshot) => {
		let appointments = [];
		let promises = [];
		snapshot.forEach((doc) => {
			let appointmentFlat = helperFunctions.flatData(doc);
			if (appointmentFlat.timeslotId) {
				promises.push(
					db.collection('timeslots').doc(appointmentFlat.timeslotId).get()
					.then((timeslot) => {
						appointmentFlat.timeslot = helperFunctions.flatData(timeslot);
						appointments.push(appointmentFlat);
						return appointments;
					})
				)
			}
		});
		Promise.all(promises).then(() => {
			res.send(appointments);
		});
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
router.post('/appointments/',isAuthenticated,validateModel("appointment",["comment","timeSlotId","video"]), (req, res) => {
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
	appointment.video = appointmentBody.video;
	appointment.reservedBy = admin.firestore().collection("users").doc(req.user.uid);
	appointment.timeslotId = admin.firestore().collection("timeslots").doc(appointmentBody.timeSlotId);
	admin.auth().getUser(req.user.uid).then((userRecord) => {
		sendNewAppointmentMail(userRecord);
	});
	// At the moment a static user id which is the consultant, if we decide to let the user chose a consultant we can get the consultant
	// admin.auth().getUser("kXKvHb3WlYWIQu3LxUzyYZVuFHt2").then((userRecord) => {
	// 	sendConsultNewAppointmentMail(userRecord);
	// 	console.log('Send email');
	// });
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
 *  @api {PUT} /appointments/:id updating appointment
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
router.put('/appointments/:appointmentId/',isAuthenticated, validateModel('appointment',['canceled','comment','video','approved']), (req, res) => {
	db.collection('appointments').doc(req.params.appointmentId).update(req.body.appointment)
	.then((doc) => {
		res.status(200).send("Ok");
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

/**
*  @api {PUT} /appointments/:id updating appointment
*  @apiName Update a appointment
*  @apiGroup Appointments
*
*  @apiSuccess {String} Appointment updated
*  @apiSuccessExample Success-Response:
*  HTTP/1.1 204 OK
*  @apiUse InternalServerError
*  @apiUse UserAuthenticated
*  @apiUse Forbidden
**/
router.put('/admin/appointments/:appointmentId/',isAdmin, validateModel('appointment',['canceled','comment','video','approved','timeslotId','reservedBy']), (req, res) => {
	let appointment = req.body.appointment;
	appointment.reservedBy = admin.firestore().collection("users").doc(appointment.reservedBy);
	appointment.timeslotId = admin.firestore().collection("timeslots").doc(appointment.timeslotId);
	db.collection('appointments').doc(req.params.appointmentId).update(appointment)
	.then((doc) => {
		res.status(200).send("Ok");
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

const sendNewAppointmentMail = (user) => {
	mailer.mail(user.email, "Appointment Bassleer", "Hello, We are sending you this email to confirm that you have requested an appointment with a consultant of Bassleer.");
};

const sendAppointmentApprovedMail = (user) => {
	mailer.mail(user.email, "Appointment approved Bassleer", "Hello, We are sending you this email to confirm that you have made an appointment with a consultant.");
};

const sendAppointmentCanceledMail = (user) => {
	mailer.mail(user.email, "Appointment canceled Bassleer", "Hello, We are sending you this email to inform you that your appointment has been canceled.");
};

const sendConsultNewAppointmentMail = (user) => {
	mailer.mail(user.email, "New Appointment", "Hallo, een gebruiker heeft een aanvraag gedaan voor een afspraak.");
};

module.exports = router;