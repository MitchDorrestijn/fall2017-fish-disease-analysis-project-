const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

const notifications = require('../notifications/notifications.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');

// returns all aquaria of current logged in user
/**
 *  @api {get} /aquaria/ Request all aquaria of user
 *  @apiName GetAquaria
 *  @apiGroup Aquaria
 *
 *  @apiSuccess {Array} aquaria List of aquaria
 *  @apiError Internal Server Error
 *  @apiUse UserAuthenticated
 */
router.get('/aquaria/', isAuthenticated, (req, res) => {
	db.collection("aquaria").where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		let aquaria = [];
		snapshot.forEach((doc) => {
			aquaria.push(doc.data());
		});
		res.send(aquaria);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});


/**
 *  @api {get} /aquaria/:id returns an aquarium if owned by user
 *  @apiName GetAquariaByID
 *  @apiGroup Aquaria
 *
 *  @apiSuccess {Object} Aquarium data
 *  @apiError Internal Server Error
 *  @apiUse UserAuthenticated
 */
router.get('/aquaria/:id', isAuthenticated, (req, res) => {
	db.collection("aquaria").where("id", "==", req.params.id).where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		return res.status(200).send({
			aquarium: snapshot.docs[0].data()
		});
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

// creates an aquarium for logged in user
router.post('/aquaria/', isAuthenticated, (req, res) => {
	const allowedDataKeys = ["name"];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	data.user = req.user.ref;

	db.collection("aquaria").add(data)
	.then((newDoc) => {
		return newDoc.update({id: newDoc.id});
	})
	.then(() => {
		res.sendStatus(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

// Updates aquarium if owned by user
router.post('/aquaria/:id', isAuthenticated, (req, res) => {
	if (!req.body.data){
		res.sendStatus(422);
	}

	// Specify the keys accepted by the process.
	const allowedDataKeys = ["name"];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	db.collection("aquaria").where("id", "==", req.params.id).where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		return snapshot.docs[0].ref.update(data);
	})
	.then(() => {
		res.sendStatus(200);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

// returns all fish within an aquarium
router.get('/aquaria/:id/fish', isAuthenticated, (req, res) => {
	db.collection("aquaria").where("id", "==", req.params.id).where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		if (snapshot.empty){
			reject(new Error("Aquarium non existent or not owned by user."));
		}
		const doc = snapshot.docs[0];
		return db.collection("fish").where("aquarium", "==", doc.ref).where("user", "==", req.user.ref).get();
	})
	.then((snapshot) => {
		let fish = [];
		snapshot.forEach((doc) => {
			// Preventing firebase from sending the document reference over JSON. Replacing the references with ID's.
			let data = doc.data();
			data.user = data.user.id;
			data.aquarium = data.aquarium.id;
			fish.push(data);
		});
		res.send({fish : fish});
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

// Adds a fish to aquarium
router.post('/aquaria/:id/fish', isAuthenticated, (req, res) => {
	if (!req.body.data){
		return res.status(400).send("Payload expected. Serve an object with root key *data*");
	}

	const allowedDataKeys = ["species"];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	const aquariumRef = db.collection("aquaria").doc(req.params.id);

	data.user = req.user.ref;
	data.aquarium = aquariumRef;

	db.collection("fish").add(data)
	.then((newDoc) => {
		return newDoc.update({id: newDoc.id});
	})
	.then(() => {
		res.sendStatus(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	});
});

// Edits a fish in aquarium
router.put('/aquaria/:id/fish/:fid', isAuthenticated, (req, res) => {
	res.status(500).send("fish edit - not yet implemented");
});

// Get all entries from aquarium
router.get('/aquaria/:id/entries', isAuthenticated, (req, res) => {
	const aquarium = db.collection("aquaria").doc(req.params.id);

	//db.collection("entries").where("aquarium", "==", aquarium).where("user", "==", req.user.ref).get()
	db.collection("aquaria").doc(req.params.id).collection("entries").get()
	.then((snapshot) => {
		console.log(snapshot);
		if(snapshot.empty){
			res.send("Nothing found");
		}

		const diary = {};
		diary.aquarium = aquarium;
		diary.user = req.user.ref;
		diary.entries = [];

		snapshot.forEach((doc)=> {
			diary.entries.push(doc.data());
		})
		res.send(diary);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

// Add aquarium entry
router.post('/aquaria/:id/entries', isAuthenticated, (req, res) => {
	const entry = req.body.entry;

	// Warning: no model validation
	db.collection("aquaria").doc(req.params.id).collection("entries").add(entry)
	.then(() => {
		return notifications.add(req.user.uid, "A entry has been added to the journal.", 1)
	})
	.then(() => {
		res.send(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

module.exports = router;