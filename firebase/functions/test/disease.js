let assert = require('assert');
const request = require('superagent');
const serviceAccount = require("../private-key.json");

const admin = require('firebase-admin');
const firebase = require("firebase");

let signInMock = () => { 
    return new Promise((resolve, reject) => {
        let uid;
        firebase.auth().signInWithEmailAndPassword("jaapweijland@gmail.com", "abcdefg")
        .then(function(result){
            if(result){
                uid = result.uid;
                return firebase.auth().currentUser.getIdToken()
            }
        })
        .then(function(data) {
            resolve({ 
                token: data, 
                uid: uid
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
    })
}

describe('Disease APIs', () => {
    it('should return 201 when disease is added', (done) => {
        signInMock().then((userDetails) => {
            request
            .post('http://localhost:5000/api/diseases')
            .set('Authorization', 'Token ' + userDetails.token)
            .send({
                disease: {
                    name: "tering",
                    description: "hele erge ziekte"
                }
            })
            .end((err, res) => {
                assert.ok(res.status == 201);
                done();
            });
        })
    }).timeout(5000);

    it('should return 200 when searching for diseases', (done) => {
        signInMock().then((userDetails) => {
            request
            .get('http://localhost:5000/api/diseases/search?term=tering')
            .set('Authorization', 'Token ' + userDetails.token)
            .end((err, res) => {
                assert.ok(res.status == 200);
                done();
            });
        })
    }).timeout(5000);
});