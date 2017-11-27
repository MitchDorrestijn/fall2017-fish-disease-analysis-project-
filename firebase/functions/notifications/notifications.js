const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = {
    add: (userId, message, type) => {
        return new Promise((resolve, reject) => {
            db.collection("notifications").add({
                user: db.collection('users').doc(userId),
                message: message,
                type: type,
                isRead: false,
                date: Date.now()
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        });
    },
    
    setRead: (id) => {
        return new Promise((resolve, reject) => {
            db.collection("notifications").doc(id).update({
                isRead: true
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }
}