const admin = require('firebase-admin');
const db = admin.firestore();

class Notificator {
    add(userId, message, type) {
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
    }
    
    setRead(id) {
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

    push(token, payload) {
        /*
        Voorbeeld model

        const payload = {
            notification: {
                title: "Test vanuit de server",
                body: "Wat mooi zeg!"
            }
        }
        */
        //return new Promise((resolve, reject) => {
            return admin.messaging().sendToDevice(token, payload)
        //    .then((result) => {
        //        resolve(result);
        //    })
        //    .catch((error) => {
        //        reject(error);
        //    });
        //})
    }
}

module.exports = new Notificator();

/* module.exports = {
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
} */