const fs = require ("fs");
const assert = require ("assert");
const request = require ("superagent");
const firebase = require ("firebase");

const config = {
	apiKey: "AIzaSyBxbF0vZXeq8ItH9SsQvO8Ynev_5-lGffs",
	authDomain: "fishproject-47cfd.firebaseapp.com",
	databaseURL: "https://fishproject-47cfd.firebaseio.com",
	projectId: "fishproject-47cfd",
	storageBucket: "fishproject-47cfd.appspot.com",
	messagingSenderId: "324776878982"
};

const email = "jaapweijland@gmail.com";
const password = "abcdefg";
const server = "http://localhost:5000/api";

const app = firebase.initializeApp (config);
let token;

let waitForToken = () => new Promise ((resolve, reject) => {
	if (!token) {
		app.auth ().signInWithEmailAndPassword (email, password).then (() => {
			app.auth ().currentUser.getIdToken ().then ((result) => {
				token = result;
				resolve ();
			}).catch ((error) => {
				console.log (error);
				reject (error);
			});
		}).catch ((error) => {
			console.log (error);
			reject (error);
		});
	} else {
		resolve ();
	}
});

waitForToken ();

describe ("Aquarium", () => {
	let aquariumId;
	it ("should return 201 if aquaria are being created", (done) => {
		waitForToken ().then (() => {
			request
			.post (server + '/aquaria')
			.set ('Authorization', 'Token ' + token)
			.set ('Content-Type', 'application/json')
			.send ({data: {name: "test390409834"}})
			.end ((err, res) => {
				if (err || res.status !== 201) {
					assert.ok (false);
					done ();
				} else {
					assert.ok (true);
					let body = JSON.parse (res.text);
					aquariumId = body.aquarium.id;
					done ();
				}
			});
		}).catch ((error) => {
			console.log (error);
			done ();
		});
	}).timeout (5000);

	it ("should return 200 if aquaria are being fetched", (done) => {
		waitForToken ().then (() => {
			request
				.get (server + '/aquaria')
				.set ('Authorization', 'Token ' + token)
				.end ((err, res) => {
				if (err || !res.ok) {
					assert.ok (false);
					done ();
				} else {
					assert.ok (true);
					done ();
				}
			});
		}).catch ((error) => {
			console.log (error);
			done ();
		});
	}).timeout (5000);

	it ("should return 200 if the right aquarium is being fetched", (done) => {
		waitForToken ().then (() => {
			request
			.get (server + '/aquaria/' + aquariumId)
			.set ('Authorization', 'Token ' + token)
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (res.status);
					assert.ok (false);
					done ();
				} else {
					assert.ok (true);
					done ();
				}
			});
		}).catch ((error) => {
			console.log (error);
			done ();
		});
	}).timeout (5000);
});
