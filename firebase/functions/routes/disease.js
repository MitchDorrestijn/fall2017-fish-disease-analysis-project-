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
    db.collection("diseases").add(req.body.disease);
})

router.get('/diseases/search', isAuthenticated, (req, res) => {
    const index = client.initIndex("diseases");
    const query = req.query.term;

    index
    .search({
        query
    })
    .then(responses => {
        // Response from Algolia:
        // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
        console.log(responses.hits);
    });
})

module.exports = router;