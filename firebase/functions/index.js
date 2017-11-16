const functions = require('firebase-functions');
const express = require('express');

const admin = require('firebase-admin');
const serviceAccount = require("./private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

const userRoutes = require('./routes/user.js');
const registrationRoutes = require('./routes/registration.js');
const authenticate = require('./middleware/authenticate.js');

/* Express */
const app = express();

/* Settings for serving files */
app.use(express.static('../public'))

/* Routes to different API endpoints */
app.use('/api', userRoutes);
app.use('/api', registrationRoutes);

/* Middlewares */
//app.use('*', authenticate)

/* Main route */

// /* Test routes for development */
app.get("/api/home", (request, response) => {
	response.send("Hello from Express on Firebase!");
})

exports.app = functions.https.onRequest(app);