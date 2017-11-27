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

describe ("User", () => {
	it ("should return 201 if user is created", (done) => {
		request
		.post (server + '/users/' + app.auth().currentUser.uid)
		.set ('Authorization', 'Token ' + token)
		.send ({
			firstName: "Sjoerd",
			lastName: "Scheffer",
			password: "Eenwachtwoord123",
			country: "Netherlands",
			birthDate: "1995-03-10T00:00:00.000Z"
		})
		.end ((err, res) => {
			if (err || res.status !== 201) {
				assert.ok (false);
				done ();
			} else {
				assert.ok (true);
				done ();
			}
		});
	}).timeout (5000);
	it ("should return 200 if user is fetched", (done) => {
		waitForToken ().then (() => {
			request
			.get (server + '/users/' + app.auth().currentUser.uid)
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
});
