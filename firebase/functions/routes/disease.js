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

const db = admin.firestore();

/*
    Fish disease model:
    - name,
    - symptoms,
    - description,
    - treatment
*/
router.post('/diseases', isAuthenticated, (req, res) => {
    db.collection('diseases').add(req.body.disease)
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

router.get('/diseases/search', isAuthenticated, (req, res) => {
    const index = client.initIndex("diseases");
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

module.exports = router;