const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("./private-key.json");
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

// Import routes
const userRoutes = require('./routes/user.js');
const registrationRoutes = require('./routes/registration.js');
const aquariumRoutes = require('./routes/aquarium.js');

// Import middleware
const authenticate = require('./middleware/authenticate.js');
const functionsMiddleware = require('./middleware/functions.js');

/* Express */
const app = express();

/* Settings for express */
app.use(express.static('../public'));
app.use(cors({origin: '*'}));

/* Middlewares */
app.use('*', authenticate);
app.use('*', functionsMiddleware)

/* Routes to different API endpoints */
app.use('/api', userRoutes);
app.use('/api', registrationRoutes);
app.use('/api', aquariumRoutes);

/* Main route */

// /* Test routes for development */
app.get("/api/home", (request, response) => {
	response.send("Hello from Express on Firebase!");
});

exports.app = functions.https.onRequest(app);

exports.deleteUserFromDatabaseWhenDeleted = functions.auth.user().onDelete(event => {
	const user = event.data;
	return admin.firestore().collection("users").doc(user.uid).delete()
});