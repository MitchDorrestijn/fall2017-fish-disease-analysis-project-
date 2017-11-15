const functions = require('firebase-functions');
const express = require('express');
const userRoutes = require('./routes/user.js');
const authenticate = require('./middleware/authenticate.js');

const admin = require("firebase-admin");
const serviceAccount = require("./private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

/* Express */
const app = express();

app.use('', userRoutes);
app.use('*', authenticate)

app.get("/", (request, response) => {
  response.send("Hello from root!");
})

app.get("/home", authenticate, (request, response) => {
  response.send("Hello from Express on Firebase!");
})

app.get("/other", (request, response) => {
  response.send("Hello from Express on other!");
})

app.get("/user/", (request, response) => {
  response.send("Hello from Express on other!");
})

exports.app = functions.https.onRequest(app);