/* Dependencies */
const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("./private-key.json");
const cors = require('cors');
const algoliasearch = require('algoliasearch');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

// Custom helper modules
const notifications = require('./notifications/notifications.js');
const statusChecker = require('./status_checker/checker.js');

/* Algolia, used for search */
const ALGOLIA_ID = "WPBUCLWL7Y";
const ALGOLIA_ADMIN_KEY = "e587aaec3eec56edbf94efc42315ca9d";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

// Import routes
const userRoutes = require('./routes/user.js');
const registrationRoutes = require('./routes/registration.js');
const aquariumRoutes = require('./routes/aquarium.js');
const diseaseRoutes = require('./routes/disease.js');
const notificationRoutes = require('./routes/notification.js');
const speciesRoutes = require('./routes/species.js');
const appointmentRoutes = require('./routes/appointment.js');

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
app.use('*', functionsMiddleware);

/* Routes to different API endpoints */
app.use('/api', userRoutes);
app.use('/api', registrationRoutes);
app.use('/api', aquariumRoutes);
app.use('/api', diseaseRoutes);
app.use('/api', notificationRoutes);
app.use('/api', speciesRoutes);
app.use('/api', appointmentRoutes);

/* Main route */

// /* Test routes for development */
app.get("/api/home", (request, response) => {
	response.send("Hello from Express on Firebase!");
});

exports.app = functions.https.onRequest(app);

exports.deleteUserFromDatabaseWhenDeleted = functions.auth.user().onDelete(event => {
	const user = event.data;
	return admin.firestore().collection("users").doc(user.uid).delete();
});

// Logic getting executed when an entry is submitted. It will check whether something is wrong with the water.
exports.checkEntryDataForDangerousMutations = functions.firestore.document("aquaria/{aquarium}/entries/{entry}").onCreate(event => {
	return admin.firestore().collection("aquaria").doc(event.params.aquarium).get()
	.then((doc) => {
		console.log(doc);
		return doc.data().user.get()
	})
	.then((user) => {
		console.log(user);
		const entry = event.data.data()
		statusChecker.check(user.id, entry)
	})
	.catch((error) => {
		console.log(error.message);
	})
});

// Add id to all documents
exports.addIDtoAllDocs = functions.firestore.document("{collection}/{docID}").onCreate(event => {
	return event.data.ref.set({id: event.params.docID}, { merge: true });
});

const upsertDiseaseToAlgolia = (event) => {
	// Get the disease document
	const disease = event.data.data();
	
	// Add an "objectID" field which Algolia requires
	disease.objectID = event.params.id;
	
	// Write to the algolia index
	const index = client.initIndex("diseases");
	return index.saveObject(disease);
}

// Update the search index every time a blog post is written.
exports.onDiseaseCreated = functions.firestore.document("diseases/{id}").onCreate(event => {
	return upsertDiseaseToAlgolia(event);
});

exports.onDiseaseUpdated = functions.firestore.document("diseases/{id}").onUpdate(event => {
	return upsertDiseaseToAlgolia(event);
});

exports.onDiseaseDeleted = functions.firestore.document("diseases/{id}").onDelete(event => {
	// Write to the algolia index
	const index = client.initIndex("diseases");
	return index.deleteObject(event.params.id);
});

const upsertSpeciesToAlgolia = (event) => {
	// Get the disease document
	const species = event.data.data();
	
	// Add an "objectID" field which Algolia requires
	species.objectID = event.params.id;
	
	// Write to the algolia index
	const index = client.initIndex("species");
	return index.saveObject(species);
}

// Update the search index every time a blog post is written.
exports.onSpeciesCreated = functions.firestore.document("species/{id}").onCreate(event => {
	return upsertSpeciesToAlgolia(event);
});

exports.onSpeciesUpdated = functions.firestore.document("species/{id}").onUpdate(event => {
	return upsertSpeciesToAlgolia(event);
});

exports.onSpeciesDeleted = functions.firestore.document("species/{id}").onDelete(event => {
	// Write to the algolia index
	const index = client.initIndex("species");
	return index.deleteObject(event.params.id);
});