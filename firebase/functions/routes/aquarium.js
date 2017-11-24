// TODO: Add success scenarios examples
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

const notifications = require('../notifications/notifications.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');

/**
 *  @api {get} /aquaria/ Get All Aquaria
 *  @apiName Returns all aquaria of current logged in user
 *  @apiGroup Aquaria
 *
 *  @apiSuccess {Array} aquaria List of aquaria
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/aquaria/', isAuthenticated, (req, res) => {
	db.collection('aquaria').
		where('user', '==', req.user.ref).
		get().
		then((snapshot) => {
			let aquaria = [];
			snapshot.forEach((doc) => {
				aquaria.push(doc.data());
			});
			res.send(aquaria);
		}).
		catch((err) => {
			res.status(500).send(err.message);
		});
});

/**
 *  @api {get} /aquaria/:id Get Aquaria By ID
 *  @apiName Returns an aquarium if owned by user
 *  @apiGroup Aquaria
 *
 *  @apiSuccess {Object} aquarium with aquarium data
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.get('/aquaria/:id', isAuthenticated, (req, res) => {
	db.collection('aquaria').
		where('id', '==', req.params.id).
		where('user', '==', req.user.ref).
		get().
		then((snapshot) => {
			if (snapshot.empty) {
				return Promise.reject(
					new Error('Aquarium non existent or not owned by user.'));
			}
			return res.status(200).send({
				aquarium: snapshot.docs[0].data(),
			});
		}).
		catch((error) => {
			res.status(500).send(error.message);
		});
});

/**
 *  @api {post} /aquaria/ Create Aquarium
 *  @apiName Creates an aquarium for logged in user
 *  @apiGroup Aquaria
 *  @apiParam {String} Name of aquarium
 *
 *  @apiSuccess {Object} Aquarium
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 */
router.post('/aquaria/', isAuthenticated, (req, res) => {
	const allowedDataKeys = ['name'];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	data.user = req.user.ref;

	db.collection('aquaria').add(data).then((newDoc) => {
		return newDoc.update({id: newDoc.id});
	}).then(() => {
		res.sendStatus(201);
	}).catch((error) => {
		res.status(500).send(error.message);
	});
});

/**
 *  @api {post} /aquaria/:id Update aquarium
 *  @apiName Updates aquarium if owned by user
 *  @apiGroup Aquaria
 *  @apiParam {String} id id of aquarium
 *
 *  @apiSuccess {Object} Updated aquarium data object
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse UnprocessableEntity
 */
router.post('/aquaria/:id', isAuthenticated,(req, res) => {
	if (!req.body.data) {
		return res.sendStatus(422);
	}
	// Specify the keys accepted by the process.
	const allowedDataKeys = ['name'];
	const data = req.body.data;
	req.removeIllegalKeys(allowedDataKeys, data);

	db.collection('aquaria').
		where('id', '==', req.params.id).
		where('user', '==', req.user.ref).
		get().
		then((snapshot) => {
			if (snapshot.empty) {
				return Promise.reject(
					new Error('Aquarium non existent or not owned by user.'));
			}
			return snapshot.docs[0].ref.update(data);
		}).
		then(() => {
			res.sendStatus(200);
		}).
		catch((error) => {
			res.status(500).send(error.message);
		});
});

/**
 *  @api {post} /aquaria/:id Return all fish
 *  @apiName Returns all fish within an aquarium
 *  @apiGroup Aquaria
 *  @apiParam {String} id id of aquarium
 *
 *  @apiSuccess {Object} Object fish with and array of fish
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse UnprocessableEntity
 */
router.get('/aquaria/:id/fish', isAuthenticated, (req, res) => {
	db.collection('aquaria').
		where('id', '==', req.params.id).
		where('user', '==', req.user.ref).
		get().
		then((snapshot) => {
			if (snapshot.empty) {
				reject(
					new Error('Aquarium non existent or not owned by user.'));
			}
			const doc = snapshot.docs[0];
			return db.collection('fish').
				where('aquarium', '==', doc.ref).
				where('user', '==', req.user.ref).
				get();
		}).
		then((snapshot) => {
			let fish = [];
			snapshot.forEach((doc) => {
				// Preventing firebase from sending the document reference over JSON. Replacing the references with ID's.
				let data = doc.data();
				data.user = data.user.id;
				data.aquarium = data.aquarium.id;
				fish.push(data);
			});
			res.send({fish: fish});
		}).
		catch((error) => {
			res.status(500).send(error.message);
		});
});

/**
 *  @api {post} /aquaria/:id/fish Adds fish
 *  @apiName Adds a fish to an aquarium
 *  @apiGroup Aquaria
 *  @apiParam {String} id id of aquarium
 *  @apiParam {String} species
 *
 *  @apiSuccess {Object} Notification which has been added
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse UnprocessableEntity
 */
router.post('/aquaria/:id/fish', isAuthenticated, (req, res) => {
	if (!req.body.data) {
		return res.sendStatus(422);
	}

	const allowedDataKeys = ['species'];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	const aquariumRef = db.collection('aquaria').doc(req.params.id);

	data.user = req.user.ref;
	data.aquarium = aquariumRef;

	db.collection('fish').add(data).then((newDoc) => {
		return newDoc.update({id: newDoc.id});
	}).then(() => {
		res.sendStatus(201);
	}).catch((error) => {
		res.status(500).send(error.message);
	});
});

// Edits a fish in aquarium
router.put('/aquaria/:id/fish/:fid', isAuthenticated, (req, res) => {
	res.status(500).send('fish edit - not yet implemented');
});

/**
 *  @api {get} /aquaria/:id/entries  Get all aquarium entries
 *  @apiName Get all entries from aquarium
 *  @apiGroup Aquaria
 *  @apiParam {String} id id of aquarium
 *
 *  @apiSuccess {Object} Notification which has been added
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse EmptyReturn
 */
router.get('/aquaria/:id/entries', isAuthenticated, (req, res) => {
	const aquarium = db.collection('aquaria').doc(req.params.id);

	//db.collection("entries").where("aquarium", "==", aquarium).where("user", "==", req.user.ref).get()
	db.collection('aquaria').doc(req.params.id).collection('entries').get()
	.then((snapshot) => {
		console.log(snapshot);
		if (snapshot.empty) {
			res.status(204).send('Nothing found');
		}

		const diary = {};
		diary.aquarium = aquarium;
		diary.user = req.user.ref;
		diary.entries = [];

		snapshot.forEach((doc) => {
			diary.entries.push(doc.data());
		});
		res.send(diary);
	}).
	catch((error) => {
		res.status(500).send(error.message);
	});
});

/**
 *  @api {post} /aquaria/:id/entries Adding An Entry
 *  @apiName Add entry to an aquaria
 *  @apiGroup Aquaria
 *  @apiParam {String} id id of aquarium
 *
 *  @apiUse InternalServerError
 *  @apiUse UserAuthenticated
 *  @apiUse HTTPCreated
 */
router.post('/aquaria/:id/entries', isAuthenticated, (req, res) => {
	const entry = req.body.entry;

	// Warning: no model validation
	return db.collection("aquaria").doc(req.params.id).collection("entries").add(entry)
	.then(() => {
		res.send(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

module.exports = router;