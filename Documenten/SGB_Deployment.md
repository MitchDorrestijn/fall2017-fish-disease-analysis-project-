## Deployment
Dit hoofdstuk zal uitleggen welke stack er gebruikt wordt om het product te draaien.

### Software
De omgeving van productie zijn de servers van Firebase. Firebase draait op Google App Engine. De volgende producten worden gebruikt bij deployment:
- Firebase Cloud Functions (NodeJS omgeving, Node v6.11.5.),
- Firebase Firestore (NoSQL database),
- Firebase Cloud Messaging (Push Notifications service),
- Firebase Realtime Database (Structured Real Time Database),
- Firebase Hosting (hosting van statische files),
- Firebase Authentication (user management),
- Firebase Storage (Voor het dynamisch uploaden van files, zoals images).

### Build
Het is niet nodig om dit project te builden.

### Deploy
Om het project te deployen naar de servers van Firebase, navigeer naar de map /functions, en type "firebase deploy". Mocht je alleen bepaalde facetten willen deployen, doe dan firebase deploy --only functions[,firestore,...].
