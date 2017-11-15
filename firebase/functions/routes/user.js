const express = require('express');
const router = express.Router();

// define the home page route
router.get('/user/', function (req, res) {
  res.send('User page');
})
// define the about route
router.get('/user/other/', function (req, res) {
  res.send('Other user page');
})

module.exports = router