# External Interfaces

## Internal

Een Node js server wordt ingezet waarop een react applicatie draait. Via https requests naar een firebase server worden alle data interacties gehandeld.

## External

#### Firebase

Er wordt in de applicatie gebruik gemaakt van de volgende firebase producten:

##### [Real-time database](https://firebase.google.com/docs/database/)

Wordt gebruikt voor om de webrtc verbinding op te zetten. 

**[Cloud functions](https://firebase.google.com/docs/functions/)**

Deze functies worden gebruikt als triggers voor:

- Het bijhouden van de Algolia zoek indexes
- Notificaties
- Tijdslot einddatums bereken

**[Cloud Firestore](https://firebase.google.com/docs/firestore/)**

Cloud Firestore is een NoSql scalable cloud database

In deze database wordt alle data opgeslagen van de webapplicatie

**[Cloud Storage](https://cloud.google.com/storage/docs/)**

Cloud storage wordt gebruikt om images te versturen tussen twee clients.

**[Authentication](https://firebase.google.com/docs/auth/)**

Er wordt gebruik gemaakt van authentication module voor email verificatie.

Er wordt een verificatie token bijgehouden die kan worden geverifieerd.

**[Cloud messaging](https://firebase.google.com/docs/cloud-messaging/server)**

De Node.js server verbindt met een FCM server van google. Hierdoor kunnen notificaties worden gestuurd op smartphone en in de browsers.

#### [Sendgrid](https://sendgrid.com/docs)

Sendgrid is een cloudbased mail systeem. De Node.js server verbindt met deze mail server.

#### [WebRTC](https://webrtc.org/)

WebRTC is een API die er voor zorgt dat smartphones en browsers gebruik kunnen maken van Real-Time Communications (RTC) .

Wordt gebruikt voor realtime video chat en tekst chat.

#### [Algolia](https://www.algolia.com/doc/)

Algolia is een API wat gebruikt wordt voor zoekfunctionaliteit. Op Algolia zijn zoek indexen ingesteld.

De Node.js server verbindt met de API van Algolia en krijgt zoekresultaten terug. 