# 2. Functional overview

Dit hoofdstuk bevat informatie over de infrastructuur van de website.


### Live omgeving

De live omgeving is niet heel erg complex; het is namelijk een enkele cloud server gehost door Google's Firebase:
Opzet: https://firebase.google.com/docs/web/setup#host_your_web_app_using_firebase_hosting
Systeem: Node 8.9.1 LTS
Type: cloud server

## Development omgeving

Voor de development wordt er gebruik gemaakt van GitHub. In de 'development' branch worden alle elementen geplaatst, na een sprint review wordt dezze brancht gekopieerd naar de 'master'. De 'master' branch is altijd de laatste versie en is te zien op bassleer.nl.

## Infrastructure diagram
Deze komt nog

## STUN-server
De stun server wordt gebruikt voor communicatie via webRTC. WebRTC wordt gebruikt in tijdens chatsessies. De STUN-server die gebruikt wordt wordt aangeleverd door google.

Een STUN (Simple Traversal of User Datagram Protocol [UDP] Through Network Address Translators [NAT’s]) server stelt NAT-clients (dus computers achter een firewall) in staat om telefoongesprekken op te zetten met een VOIP-provider buiten het lokale netwerk.
(Bron: https://www.3cx.nl/voip-sip/stun-server/)


## Sidenotes
Google Firebase is verantwoordelijk voor het updaten en onderhouden van de servers. Dhr. Bassleer is verantwoordelijk voor het maken van backups, de recources zijn staan ook op naam van Dhr. Bassleer.
