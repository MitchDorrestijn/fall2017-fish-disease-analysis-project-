importScripts("https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js")

var config = {
    apiKey: "AIzaSyBxbF0vZXeq8ItH9SsQvO8Ynev_5-lGffs",
    authDomain: "fishproject-47cfd.firebaseapp.com",
    databaseURL: "https://fishproject-47cfd.firebaseio.com",
    projectId: "fishproject-47cfd",
    storageBucket: "fishproject-47cfd.appspot.com",
    messagingSenderId: "324776878982"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

const naam = "Jaap";

messaging.setBackgroundMessageHandler((payload) => {
    return self.registration.showNotification(payload.notification.title, {body: payload.notification.body});
});