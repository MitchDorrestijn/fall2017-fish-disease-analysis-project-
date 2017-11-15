const express = require('express');
const router = express.Router();

// route for a user to register.
router.post('/register/', function (req, res) {

    res.send('Aquarium page');
})

module.exports = router