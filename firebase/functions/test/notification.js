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

describe('Notification APIs', () => {
    it('should return 200 when notifications are loaded', (done) => {
        signInMock().then((userDetails) => {
            request
            .get('http://localhost:5000/api/notifications')
            .set('Authorization', 'Token ' + userDetails.token)
            .end((err, res) => {
                assert.ok(res.status == 200);
                done();
            });
        })
    }).timeout(5000);
});