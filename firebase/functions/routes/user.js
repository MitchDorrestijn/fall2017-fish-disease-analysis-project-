const express = require('express');
const router = express.Router();

// define the home page route
router.get('/user/', (req, res) => {
  res.send('User page');
});
// define the about route
router.get('/user/other/', (req, res) => {
  res.send('Other user page');
});

module.exports = router;