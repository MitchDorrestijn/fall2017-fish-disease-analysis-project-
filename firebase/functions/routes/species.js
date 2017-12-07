const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

/* Algolia */
const ALGOLIA_ID = "WPBUCLWL7Y";
const ALGOLIA_ADMIN_KEY = "e587aaec3eec56edbf94efc42315ca9d";
const ALGOLIA_INDEX_NAME = "notes";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');

const db = admin.firestore();

/* Model Definition */
const model = {
    name: "species",
    endpoint: "species",
    keys: ["name", "lol"]
}

router.get('/' + model.endpoint, isAuthenticated, (req, res) => {
    db.collection(model.endpoint).get()
    .then((snapshot) => {
        let array = [];
        snapshot.docs.forEach((doc) => {
            array.push(doc.data());
        })
        res.send(array);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.post('/' + model.endpoint, isAuthenticated, validateModel(model.name, model.keys), (req, res) => {
    db.collection(model.endpoint).add(req.body[model.name])
    .then((newDoc) => {
        return newDoc.get()
    })
    .then((document) => {
        res.status(201).send(document.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.put('/' + model.endpoint + '/:id', isAuthenticated, validateModel(model.name, model.keys), (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).set(req.body[model.name])
    .then((updatedDoc) => {
        res.status(200).send(updatedDoc.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.delete('/' + model.endpoint + '/:id', isAuthenticated, (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).delete()
    .then(() => {
        res.sendStatus(200);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.get('/' + model.endpoint + '/search', isAuthenticated, (req, res) => {
    const index = client.initIndex(model.endpoint);
    const query = req.query.term;

    if(!query){
        return res.status(400).send("Please provide '?term=searchterm' in url");
    }

    index
    .search({
        query
    })
    .then(responses => {
        res.send(responses.hits);
    });
})

router.get('/' + model.endpoint + '/:id', isAuthenticated, (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).get()
    .then((doc) => {
        res.send(doc.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

module.exports = router;