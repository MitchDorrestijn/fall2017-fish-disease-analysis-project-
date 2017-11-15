const express = require('express');
const router = express.Router();

// define the home page route
router.get('/aquarium/', function (req, res) {
  res.send('Aquarium page');
})
// define the about route
router.post('/aquarium/', function (req, res) {
  res.send('Posting to aquarium');
})

module.exports = router