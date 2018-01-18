const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const validator = require('validator');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');
const isAdmin = require('../middleware/isAdmin.js');

/* Helper functions */
const helperFunctions = require('../middleware/functions.js');

/**
 *  @api {GET} /opentimeslots/ get open timeslots
 *  @apiName get all open timeslots
 *  @apiGroup Timeslots
 *
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse getTimeslotsSuccess
 */
router.get('/opentimeslots/', isAuthenticated, (req, res) => {
  db.collection('appointments').get()
	.then((snapshot) => {
	  let appointmentsTimeslots = [];
	  snapshot.forEach((doc) => {
			let flatData = helperFunctions.flatData(doc);
			flatData.id = doc.id;
			appointmentsTimeslots.push({
				id: flatData.timeslotId,
			});
	  });
	  return appointmentsTimeslots;
	}).then((data) => {
	db.collection('timeslots').get().then((snapshot) => {
	  let timeslots = [];
	  snapshot.forEach((doc) => {
			let timeslot = helperFunctions.flatData(doc);
			timeslot.id = doc.id;
			let appointmentCheck = true;
			data.forEach((appointment) => {
				// Check if the appointment id equals the id of the timeslot
				if (appointment.id === timeslot.id) {
				appointmentCheck = false;
				}
			});
			// Only push unique timeslots and appointments which meet the appointment check
			if (timeslots.indexOf(timeslot) === -1 && appointmentCheck) {
				timeslots.push(timeslot);
			}
	  });
	  return res.status(200).send(timeslots);
	});
  }).catch((err) => {
	res.status(500).send(err.message);
  });
});

/**
 *  @api {GET} /timeslots/ get all timeslots
 *  @apiName get a list of all timeslots
 *  @apiGroup Timeslots
 *
 * @apiUse getTimeslotsSuccess
 */
router.get('/timeslots/', isAdmin, (req, res) => {
  db.collection('timeslots').get()
	.then((snapshot) => {
	  let timeslots = [];
	  snapshot.forEach((doc) => {
			let o = doc.data();
			o.id = doc.id;
		  timeslots.push(o);
	  });
	  res.send(timeslots);
	}).catch((err) => {
	res.status(500).send(err.message);
  });
});

/**
 *  @api {get} /timeslots/:id/ Get timeslot
 *  @apiName Returns data of a timeslot
 *  @apiGroup timeslots
 *
 *  @apiSuccess {Object} Timeslot profile object
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 {
    "endDate": "2017-12-12T17:00:00.000Z",
    "id": "IAOQ90UnsHxV4sqFFQUY",
    "startDate": "2017-12-12T16:00:00.000Z",
    "duration": "60"
}
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 **/
router.get('/timeslots/:id/', isAuthenticated, (req, res) => {
  const timeslotId = req.params.id;
  const timeslotRef = db.collection('timeslots').doc(timeslotId);
  timeslotRef.get().then(timeslotObject => {
	if (timeslotObject.empty) {
	  return Promise.reject(
		new Error('timeslot does not exist'));
	}
	return res.send(helperFunctions.flatData(timeslotObject)).status(200);
  }).catch(err => {
	res.status(400).send(err.message);
  });
});

/**
 *  @api {POST} /timeslots/ Create timeslot
 *  @apiName Creates a timeslot
 *  @apiGroup Timeslots
 *
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse ValidationError
 */
router.post('/timeslots/', isAuthenticated,
  validateModel('timeslot', ['duration', 'startDate']), (req, res) => {
	if (!req.body) {
	  return res.sendStatus(400);
	}
	const timeSlot = req.body.timeslot;
	if (!validator.isDecimal(timeSlot.duration) ||
	  !validator.isISO8601(timeSlot.startDate)
	) {
	  return res.status(400).send('Input validation failed.');
	}
	timeSlot.startDate = new Date(timeSlot.startDate);
	db.collection('timeslots')
	  .add(timeSlot)
	  .then((newDoc) => {
		return newDoc.get();
	  })
	  .then((document) => {
		res.status(201).send();
	  })
	  .catch((error) => {
		res.status(500).send(error.message);
	  });
  });

/**
 *  Admin
 *  @api {PUT} /appointment/:id Update timeslot
 *  @apiName Update timeslot
 *  @apiGroup Timeslots
 *
 *  @apiSuccess {String} TimeslotsId updated
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 203 Non-authoritative Information
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse ValidationError
 */
router.put('/timeslots/:id',
  validateModel('timeslot', ['duration', 'startDate']), isAdmin, (req, res) => {
	if (!req.body) {
	  return res.sendStatus(400);
	}
	const timeslot = req.body.timeslot;
	const timeslotId = req.params.id;
	if (!validator.isDecimal(timeslot.duration) ||
	  !validator.isISO8601(timeslot.startDate)
	) {
	  return res.status(400).send('Input validation failed.');
	}
	timeslot.startDate = new Date(timeslot.startDate);
	db.collection('timeslots').doc(timeslotId).update(timeslot)
	  .then((document) => {
		res.status(203).send();
	  })
	  .catch((error) => {
		res.status(500).send(error.message);
	  });
  });

/**
 *  Admin
 *  @api {DELETE} /appointment/:id Delete timeslot
 *  @apiName Remove a timeslot
 *  @apiGroup Timeslots
 *
 *  @apiSuccess {String} TimeslotsId deleted
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  {
 *      Timeslot id deleted
 *  }
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.delete('/timeslots/:id', isAdmin, (req, res) => {
  const timeslotsId = req.params.id;
  db.collection('timeslots').doc(timeslotsId).delete()
	.then(() => {
	  res.status(204).send('Timeslot is deleted');
	})
	.catch((error) => {
	  res.status(500).send(error.message);
	});
});

module.exports = router;