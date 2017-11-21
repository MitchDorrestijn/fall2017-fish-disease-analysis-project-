const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// returns all aquaria of current logged in user
router.get('/aquaria/', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}
	db.collection("aquaria").where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		var aquaria = [];
		snapshot.forEach((doc) => {
			aquaria.push(doc.data());
		});
		res.send(aquaria);
	}).catch((err) => {
		res.status(500).send(err.message)
	})
})

// returns an aquarium if owned by user
router.get('/aquaria/:id', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}
	db.collection("aquaria").where("id", "==", req.params.id).where("userId", "==", req.user.uid).get()
	.then((snapshot) => {
		if(snapshot.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		return res.status(200).send({
			aquarium: snapshot.docs[0].data()
		});
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

// creates an aquarium for logged in user
router.post('/aquaria/', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}
	db.collection("aquaria").add({
		name: "Name of aquarium",
		userId: req.user.uid
	})
	.then((newDoc) => {
		return db.collection("aquaria").doc(newDoc.id).update({id: newDoc.id});
	})
	.then(() => {
		res.sendStatus(201);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

// Updates aquarium if owned by user
router.post('/aquaria/:id', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}

	if(!req.body.data){
		res.sendStatus(422);
	}

	// Specify the keys accepted by the process.
	const allowedDataKeys = ["name"];
	const data = req.body.data;

	req.removeIllegalKeys(allowedDataKeys, data);

	db.collection("aquaria").where("id", "==", req.params.id).where("userId", "==", req.user.uid).get()
	.then((snapshot) => {
		if(snapshot.empty){
			return Promise.reject(new Error("Aquarium non existent or not owned by user."));
		}
		return snapshot.docs[0].ref.update(data);
	})
	.then(() => {
		res.sendStatus(200);
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

// returns all fish within an aquarium
router.get('/aquaria/:id/fish', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}

	db.collection("aquaria").where("id", "==", req.params.id).where("user", "==", req.user.ref).get()
	.then((snapshot) => {
		if(snapshot.empty){
			reject(new Error("Aquarium non existent or not owned by user."));
		}
		const doc = snapshot.docs[0]
		return db.collection("fish").where("aquarium", "==", doc.ref).where("user", "==", req.user.ref).get()
	})
	.then((snapshot) => {
		var fish = []
		snapshot.forEach((doc) => {
			// Preventing firebase from sending the document reference over JSON. Replacing the references with ID's.
			var data = doc.data();
			data.user = data.user.id
			data.aquarium = data.aquarium.id
			fish.push(data);
		})
		res.send({fish : fish});
	})
	.catch((error) => {
		res.status(500).send(error.message);
	})
})

router.post('/aquaria/:id/fish/:fid', (req, res) => {
	if(!req.user) {
		return res.status(401).send("Unauthorized");
	}
});

module.exports = router
