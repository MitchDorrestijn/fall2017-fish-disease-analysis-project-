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

router.get('/species/search', isAuthenticated, (req, res) => {
    const index = client.initIndex("species");
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
    })
    .catch((error) => {
        res.status(500).send(error.message);
    });
})

module.exports = router;