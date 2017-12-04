const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

const isAuthenticated = require('../middleware/isAuthenticated.js');

//get open timeslots
router.get('/opentimeslots/', (req, res) => {
	// get all appointment timeslot references
	db.collection("appointments").get()
	.then((snapshot) => {
		let appointmentsTimeslots = [];
		snapshot.forEach((doc) => {
			if (doc.data().timeslot != null) {
				appointmentsTimeslots.push(doc.data().timeslot);
			}
		});
		// if (appointment has a reference timeslot field)

		// res.send(appointments);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
	db.collection("timeslots").get()
	.then((snapshot) => {
		let timeslots = [];
		snapshot.forEach((doc) => {
			if (doc.data().timeslots != null) {
				timeslots.push(doc.data().timeslot);
			}
		});
		// if (appointment has a reference timeslot field)

		// res.send(appointments);
	}).catch((err) => {
		res.status(500).send(err.message);
	});

	// if canceled == false
	// 	then
	// reserved == true
});

// get all timeslots
router.get('/timeslots/', (req, res) => {
	db.collection("timeslots").get()
	.then((snapshot) => {
		let timeslots = [];
		snapshot.forEach((doc) => {
			timeslots.push(doc.data());
		});
		res.send(timeslots);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

// admin creates a timeslot
router.post('/timeslots/', (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const timeSlot = req.body;
	if (!validator.isDecimal(timeSlot.duration) ||
		!validator.isISO8601(timeSlot.startDate)
	) {
		return res.status(400).send("Input validation failed.");
	}
	timeSlot.startDate = new Date(timeSlot.startDate);
	timeSlot.reserved = false;
	db.collection('timeslots')
	.add(timeSlot)
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

//admin update timeslot
router.put('/timeslots/:id', (req, res) => {
	if (!req.body) {
		return res.sendStatus(400);
	}
	const timeslot = req.body;
	const timeslotId = req.params.id;
	if (!validator.isDecimal(timeslot.duration) ||
		!validator.isISO8601(timeslot.startDate)
	) {
		return res.status(400).send("Input validation failed.");
	}
	timeslot.startDate = new Date(timeslot.startDate);
	timeslot.reserved = false;
	db.collection('timeslots').doc(timeslotId).update(timeslot)
	.then((document) => {
		res.status(203).send();
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

/**
 *  Admin
 *  @api {DELETE} /appointment/:id Delete timeslot
 *  @apiName Remove an timeslot
 *  @apiGroup Timeslots
 *
 *  @apiSuccess {String} TimeslotsId deleted
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.delete('/timeslots/:id', (req, res) => {
	const timeslotsId = req.params.id;
	db.collection('timeslots').doc(timeslotsId).delete()
	.then(() => {
		res.status(204).send('TimeslotsId deleted');
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

module.exports = router;