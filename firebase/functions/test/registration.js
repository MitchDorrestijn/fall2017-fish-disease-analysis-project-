let assert = require('assert');
const request = require('superagent');
const serviceAccount = require("../private-key.json");

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

const firebase = require("firebase");
var config = {
    apiKey: "AIzaSyBxbF0vZXeq8ItH9SsQvO8Ynev_5-lGffs",
    authDomain: "fishproject-47cfd.firebaseapp.com",
    databaseURL: "https://fishproject-47cfd.firebaseio.com",
    projectId: "fishproject-47cfd",
    storageBucket: "fishproject-47cfd.appspot.com",
    messagingSenderId: "324776878982"
};
//firebase.initializeApp(config);

describe('Registration APIs', () => {
    it('should return 400 when there is no body posted', (done) => {
        request
        .post('http://localhost:5000/api/register')
        .send()
        .end((err, res) => {
            assert.ok(err.status == 400);
            done();
        });
    }).timeout(3000);

    it('should return 400 when the email is badly formatted', (done) => {
        request
        .post('http://localhost:5000/api/register')
        .send({
            user: {
                email: "badly.com",
                firstName: "Tester",
                lastName: "mcTest",
                country: "Testland",
                password: "somethinglongenough"
            }
        })
        .end((err, res) => {
            assert.ok(err.status == 400);
            done();
        });
    });

    it('should return 400 when a name has a number in it', (done) => {
        request
        .post('http://localhost:5000/api/register')
        .send({
            user: {
                email: "right@address.com",
                firstName: "Tester2",
                lastName: "mcTest",
                country: "Testland",
                password: "somethinglongenough"
            }
        })
        .end((err, res) => {
            assert.ok(res.status == 400);
            done();
        });
    });

    let signInMock = () => { 
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword("test@address.com", "somethinglongenough")
            .then(function(result){
                if(result){
                    const uid = result.uid;
                    firebase.auth().currentUser.getIdToken().then(function(data) {
                        //idToken = data;
                        admin.firestore().collection("users").doc(uid).get()
                        .then((document) => {
                            resolve({ 
                                token: data, 
                                uid: uid, 
                                verificationToken: document.data().verificationToken,
                                passwordForgotToken: document.data().passwordForgotToken 
                            });
                        }).catch((error) => {
                            reject(error);
                        })
                    });
                }
            }).catch((err) => {
                console.log(err.message);
            });
        })
    }

    it('should return 201 when user is created', (done) => {
        request
        .post('http://localhost:5000/api/register/')
        .send({
            user: {
                email: "test@address.com",
                firstName: "Tester",
                lastName: "mcTest",
                country: "Testland",
                password: "somethinglongenough"
            }
        })
        .end((err, res) => {
            assert.ok(res.status == 201);
            done();
        });
    }).timeout(3000);

    it('should return 200 when user asks for new password', (done) => {
        request
        .post('http://localhost:5000/forgot-password/')
        .send({
            email: "test@address.com"
        })
        .end((err, res) => {
            assert.ok(res.status == 200);
            done();
        });
    }).timeout(3000);

    it('should return 200 when user is verificated (actually redirects)', (done) => {
        signInMock().then((userDetails) => {
            request
            .get('http://localhost:5000/verify/' + userDetails.uid + '/' + userDetails.verificationToken)
            .end((err, res) => {
                assert.ok(res.status == 200);
                done();
            });
        })
    }).timeout(3000);

    it('should return 200 when user changes password', (done) => {
        signInMock().then((userDetails) => {
            request
            .post('http://localhost:5000/forgot-password/' + userDetails.passwordForgotToken)
            .send({
                password: "onehellofapassword"
            })
            .end((err, res) => {
                assert.ok(res.status == 200);
                done();
            });
        })
    }).timeout(3000);

    it('should return 204 when user is deleted', (done) => {
        signInMock().then((userDetails) => {
            request
            .delete('http://localhost:5000/api/user/' + userDetails.uid)
            .set('Authorization', 'Token ' + userDetails.token)
            .end((err, res) => {
                assert.ok(res.status == 204);
                done();
            });
        })
    });
});