// TODO: Add success scenarios examples to document
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Joi = require('joi');

const db = admin.firestore();

const notifications = require('../notifications/notifications.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js'); // DEPRECATED!
const validate = require('../middleware/validate.js');

/* Helper functions */
const helperFunctions = require('../middleware/functions.js');

/* JOI Model Validation */
const aquariumSchema = Joi.object().keys({
	name: Joi.string().min(3).max(30).required(),
	id: Joi.string().alphanum()
});

const fishSchema = Joi.object().keys({
    species: Joi.string().alphanum().required()
});

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
	db.collection('aquaria').where('user', '==', req.user.ref).get()
	.then((snapshot) => {
		let aquaria = [];
		snapshot.forEach((doc) => {
			aquaria.push(helperFunctions.flatData(doc));
		});
		res.send(aquaria);
	}).catch((err) => {
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
	db.collection("aquaria").where("id", "==", req.params.id).where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		let aquarium = snapshot.docs[0].data();
		delete aquarium.user;
		return res.status(200).send({
			aquarium: aquarium
		});
	})
	.catch((error) => {
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
//router.post('/aquaria/', isAuthenticated, validateModel("data", ["name"]), (req, res) => {
router.post('/aquaria/', isAuthenticated, validate('aquarium', aquariumSchema), (req, res) => {
	let data = req.body.aquarium;
	data.user = req.user.ref;
	let newObj = {};
	db.collection("aquaria").add(data)
	.then((newDoc) => {
		return newDoc.get();
	})
	.then((obj) => {
		newObj = obj;
		return obj.ref.set({ id: obj.id }, { merge: true });
	})
	.then(() => {
		let newData = newObj.data();
		newData.id = newObj.id;
		delete newData.user;
		res.status(201).send({aquarium: newData});
	})
	.catch((error) => {
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
router.post('/aquaria/:id', isAuthenticated, validateModel('aquarium', aquariumSchema), (req, res) => {
	db.collection('aquaria').where('id', '==', req.params.id).where('user', '==', req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty) {
			return Promise.reject(
				new Error('Aquarium non existent or not owned by user.')
			);
		}
		return snapshot.docs[0].ref.update(data);
	})
	.then((updated) => {
		return updated.get();
	})
	.then((doc) => {
		const ret = doc.data()
		if(ret.user){
			ret.user = ret.user.id
		}
		res.status(200).send(ret);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

router.delete('/aquaria/:id', isAuthenticated, (req, res) => {
	db.collection('aquaria').where('id', '==', req.params.id).where('user', '==', req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty) {
			return Promise.reject(
				new Error('Aquarium non existent or not owned by user.')
			);
		}
		return snapshot.docs[0].ref.delete();
	})
	.then(() => {
		res.sendStatus(200);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

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
	db.collection('aquaria').where('id', '==', req.params.id).where('user', '==', req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty) {
			Promise.reject(new Error('Aquarium non existent or not owned by user.'));
		}
		const doc = snapshot.docs[0];
		return db.collection('fish').
			where('aquarium', '==', doc.ref).
			where('user', '==', req.user.ref).
			get();
	})
	.then((snapshot) => {
		let fish = [];
		let promises = [];

		snapshot.forEach((doc) => {
			let fishData = helperFunctions.flatData(doc);
			promises.push(
				doc.data().species.get().then((species) => {
					fishData.species = helperFunctions.flatData(species);
					fish.push(fishData);
				})
			);
		});
		
		Promise.all(promises).then(() => {
			res.send({fish: fish});
		})
	}).
	catch((error) => {
		console.log(error);
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
router.post('/aquaria/:id/fish', isAuthenticated, validate('fish', fishSchema), (req, res) => {
	const aquariumRef = db.collection('aquaria').doc(req.params.id);

	let data = req.body.fish;
	data.user = req.user.ref;
	data.species = db.collection("species").doc(data.species);
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

	db.collection('aquaria').doc(req.params.id).collection('entries').get()
	.then((snapshot) => {
		if (snapshot.empty) {
			return res.status(204).send('Nothing found');
		}

		const diary = {};
		diary.aquarium = aquarium;
		diary.user = req.user.ref;
		diary.entries = [];

		snapshot.forEach((doc) => {
			diary.entries.push(doc.data());
		});
		return res.send(diary);
	})
	.catch((error) => {
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
	console.log(req.params.id);

	if(req.params.id == undefined){
		return res.status(400).send('Id in endpoint is undefined.');
	}

	// Warning: no model validation
	return db.collection('aquaria').doc(req.params.id).collection('entries').add(entry)
	.then(() => {
		res.send(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
});

module.exports = router;