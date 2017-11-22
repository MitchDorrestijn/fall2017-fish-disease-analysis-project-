var assert = require('assert');
const request = require('superagent');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fishproject-47cfd.firebaseio.com"
});

describe('Registration', function() {
    describe('#payload', function() {
        it('should return 400 when there is no body posted', () => {
            request
            .post('http://localhost:5000/api/register')
            .send()
            .end((err, res) => {
                assert.equal(res.status == 400);
            });
        });

        it('should return 400 when the email is badly formatted', () => {
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
                assert.equal(res.status == 400);
            });
        });

        it('should return 400 when a name has a number in it', () => {
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
                console.log(res);
                assert.equal(res.status == 400);
            });
        });

        it('should return 201 when user is created', () => {
            request
            .post('http://localhost:5000/api/register')
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
                assert.equal(res.status == 201);
            });
        });

        it('should return 204 when user is deleted', () => {
            admin.auth().getUserByEmail("test@address.com")
            .then(function(userRecord) {
                request
                .delete('http://localhost:5000/api/user/')
                .send({
                    user: {
                        email: "right@address.com",
                        firstName: "Tester",
                        lastName: "mcTest",
                        country: "Testland",
                        password: "somethinglongenough"
                    }
                })
                .end((err, res) => {
                    assert.equal(res.status == 201);
                });
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
                assert.fail("Error while fetching user from firebase");
            });
        });
    });
});