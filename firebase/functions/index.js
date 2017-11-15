const functions = require('firebase-functions');
const express = require('express');
const userRoutes = require('./routes/user.js');

/* Express */
const app = express();

app.use('', userRoutes);

app.get("/", (request, response) => {
  response.send("Hello from root!");
})

app.get("/home", (request, response) => {
  response.send("Hello from Express on Firebase!");
})

app.get("/other", (request, response) => {
  response.send("Hello from Express on other!");
})

app.get("/user/", (request, response) => {
  response.send("Hello from Express on other!");
})

exports.app = functions.https.onRequest(app);