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
 *  @api {get} /appointment/:id Get Appointment By ID
 *  @apiName Returns an appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {Object} appointment with appointment data
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/appointments/:id', isAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  const appointmentRef = db.collection('appointments').doc(appointmentId);
  appointmentRef.get().then(appointmentObject => {
	if (appointmentObject.empty) {
	  return Promise.reject(
		new Error('Appointment does not exist'));
	}
	return res.send(helperFunctions.flatData(appointmentObject)).status(200);
  }).catch(err => {
	res.status(400).send(err.message);
  });
});

/**
 *  @api {DELETE} /appointment/:id Delete appointment
 *  @apiName delete an appointment
 *  @apiGroup Appointments
 *
 *  @apiSuccess {String} Appointment deleted
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.delete('/appointments/:id', isAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  db.collection('appointments').doc(appointmentId).delete()
  .then(() => {
	res.status(204).send('Appointment is deleted');
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
  db.collection('appointments').where('reservedBy', '==', req.user.ref).get()
	.then((snapshot) => {
	  let appointments = [];
	  let promises = [];
	  snapshot.forEach((doc) => {
			let appointmentFlat = helperFunctions.flatData(doc);
			appointmentFlat.id = doc.id;
			if (appointmentFlat.timeslotId) {
				promises.push(
				db.collection('timeslots').doc(appointmentFlat.timeslotId).get()
					.then((timeslot) => {
					appointmentFlat.timeslot = helperFunctions.flatData(timeslot);
					appointments.push(appointmentFlat);
					return appointments;
					})
				);
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
router.post('/appointments/', isAuthenticated,
  validateModel('appointment', ['comment', 'timeslotId']), (req, res) => {
	if (!req.body) {
	  return res.sendStatus(400);
	}
	const appointmentBody = req.body.appointment;
	// check timeslotId
	if (!validator.isAscii(appointmentBody.comment)
	) {
	  return res.status(400).send('Input validation failed.');
	}
	const appointment = {};
	appointment.comment = appointmentBody.comment;
	appointment.status = true;
	appointment.chatLog = [];
	appointment.reservedBy = admin.firestore()
	  .collection('users')
	  .doc(req.user.uid);
	appointment.timeslotId = admin.firestore()
	  .collection('timeslots')
	  .doc(appointmentBody.timeslotId);
	admin.auth().getUser(req.user.uid).then((userRecord) => {
	  //TODO: Now commented out for development
	  // sendNewAppointmentMail(userRecord);
	});
	// Send to all consultants
	db.collection('users')
	  .where('isAdmin', '==', true)
	  .get()
	  .then((snapshot) => {
		snapshot.forEach(doc => {
		  db.collection('timeslots').doc(appointmentBody.timeslotId).get()
			.then((timeslot) => {
			  let communicationMethod;
			  //TODO: Now commented out for development
			  // sendConsultNewAppointmentMail(helperFunctions.flatData(doc), appointment.comment,communicationMethod, helperFunctions.flatData(timeslot));
			});
		});
	  });
	db.collection('appointments')
	  .add(appointment)
	  .then(() => {
		res.status(201).send();
	  })
	  .catch((error) => {
		res.status(500).send(error.message);
	  });
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
router.put('/appointments/:appointmentId/', isAuthenticated,
  validateModel('appointment', ['comment', 'status']),
  (req, res) => {
	db.collection('appointments')
	  .doc(req.params.appointmentId)
	  .update(req.body.appointment)
	  .then((doc) => {
		res.status(200).send('Ok');
	  })
	  .catch((error) => {
		res.status(500).send(error.message);
	  });
  });

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
router.get('/admin/appointments/', isAdmin, (req, res) => {
  db.collection('appointments').get().then((snapshot) => {
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
		);
	  }
	});
	Promise.all(promises).then(() => {
	  return appointments;
	}).then((appointmentsWithId) => {
	  let appointments = appointmentsWithId;
	  let promises = [];
	  appointmentsWithId.forEach((appointment) => {
		promises.push(
		  admin.auth().getUser(appointment.reservedBy).then((userRecord) => {
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
 *  @api {PUT} /admin/appointments/:appointmentId/ updating appointment
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
router.put('/admin/appointments/:appointmentId/', isAdmin,
  validateModel('appointment', ['status', 'timeslotId']), (req, res) => {
	let appointment = req.body.appointment;
	appointment.timeslotId = admin.firestore()
	  .collection('timeslots')
	  .doc(appointment.timeslotId);
	appointment.consult = req.user.ref;
	if (appointment.status) {
	  admin.firestore()
		.collection('appointments')
		.doc(req.params.appointmentId)
		.get()
		.then((snapshot) => {
		  const appointmentData = helperFunctions.flatData(snapshot);
		  admin.auth()
			.getUser(appointmentData.reservedBy)
			.then((userRecord) => {
			  console.log(userRecord);
			  // sendAppointmentstatusMail(userRecord);
			});
		});
	}
	db.collection('appointments')
	  .doc(req.params.appointmentId)
	  .update(appointment)
	  .then((doc) => {
		res.status(200).send('Ok');
	  })
	  .catch((error) => {
		res.status(500).send(error.message);
	  });
  });

/**
 *  @api {get} /appointments/:id/chatlogs Get ChatLog By ID
 *  @apiName Return chatlogs from appointment
 *  @apiGroup Chatlogs
 *
 *  @apiSuccess {Array} Array with chatlogs
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/appointments/:id/chatlogs', isAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  const appointmentRef = db.collection('appointments').doc(appointmentId);
  appointmentRef.get().then(appointmentObject => {
	if (appointmentObject.empty) {
	  return Promise.reject(
		new Error('Appointment does not exist'));
	}
	return res.send(helperFunctions.flatData(appointmentObject).chatLog)
	  .status(200);
  }).catch(err => {
	res.status(400).send(err.message);
  });
});

/**
 *  @api {POST} /appointments/:id Create chat log
 *  @apiName Add a chat log to an appointment
 *  @apiGroup Chatlogs
 *
 *  @apiUse HTTPCreated
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse Forbidden
 *  @apiUse BadRequest
 */
router.post('/appointments/:id/chatlogs', isAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  if (!req.body) {
	return res.sendStatus(400);
  }
  const body = req.body;
  const chatLog = body.chatLog;
  db.collection('appointments').doc(appointmentId).get().then((snapshot) => {
	const allChatLogs = helperFunctions.flatData(snapshot)
	  .chatLog
	  .concat(chatLog);
	db.collection('appointments').doc(appointmentId).update({
	  chatLog: allChatLogs
	}).then(() => {
	  res.send(200);
	});
  }).catch((error) => {
	res.status(500).send(error.message);
  });
});

const sendNewAppointmentMail = (user) => {
  mailer.mail(user.email, 'Appointment Bassleer',
	'Hello, We are sending you this email to confirm that you have requested an appointment with a consultant of Bassleer.');
};

const sendAppointmentstatusMail = (user) => {
  mailer.mail(user.email, 'Appointment status Bassleer',
	'Hello, We are sending you this email to confirm that your appointment has been approved by a consultant.');
};

const sendAppointmentCanceledMail = (user) => {
  mailer.mail(user.email, 'Appointment canceled Bassleer',
	'Hello, We are sending you this email to inform you that your appointment has been canceled.');
};

const sendConsultNewAppointmentMail = (
  user, appointmentComment, appointmentCommunication, timeslot) => {
  mailer.mail(user.email, 'Nieuwe afspraak',
	`Hallo,
  <br><br>
  De gebruiker ${user.firstName} ${user.lastName} heeft een aanvraag gedaan voor een afspraak.
  <br><br>
  Dit heeft betrekking tot:
  ${appointmentComment}
  <br><br>
  De startdatum van deze afspraak is:
  ${timeslot.startDate}
  <br><br>
  De duratie van de afspraak is:
  ${timeslot.duration} minuten
  `);
};

module.exports = router;