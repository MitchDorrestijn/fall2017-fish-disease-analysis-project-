# Software guidebook Fish-team
DWA project 2017

* Mitch Dorrestijn,
* Sjoerd Scheffer,
* Ruud Mullenman,
* Roy Meijer,
* Jaap Weijland,
* Coen Severein.

----

## Inhoud

1. **Context**
	* *1.1 Gerald Bassleer*
2. **Functional Overview**
	* *2.1 Zoeken van informatie over visziektes,*
	* *2.2 Analyse tool voor gebruikers met zieke vis(sen),*
	* *2.3 Bijhouden van aquarium gegevens,*
	* *2.4 Beheersystemen/CMS,*
	* *2.5 Inschrijven voor een consult,*
	* *2.6 Het consult gesprek.*
3. **Quality Attributes**
4. **Constraints**
	* *4.1 Budget,*
	* *4.2 Technologieën,*
	* *4.3 Design,*
	* *4.4 Ontwikkelmethode,*
	* *4.5 Opleveren.*
5. **Principles**
	* *5.1 Code principles,*
	* *5.2 Groeps principles.*
6. **Software Architecture**
	* *6.1 Overzicht,*
	* *6.2 Web Applicatie.*
7. **External Interfaces**
8. **Code**
9. **Data**
10. **Infrastructure Architecture**
	* *10.1 Live omgeving,*
	* *10.2 Development omgeving,*
	* *10.3 Infrastructure diagram,*
	* *10.4 STUN-server,*
	* *10.5 Sidenotes.*
11. **Deployment**
12. **Operation and Support**
	* *12.1 React,*
	* *12.2 Firebase.*
13. **Decision Log**

----

## 1. Context
Dhr.   Burgers,   onze   opdrachtgever,   wil   samen   met   dhr.   Bassleer   een   applicatie   realiseren   die viseigenaren   in   staat   stelt   visziektes   vast   te   stellen.   Zij   hebben   een   studie   gemaakt   van visziekten   en   hebben   derhalve   veel   kennis   hierover   in   huis.

Dit   project   zal   worden   uitgevoerd   door   S.   Scheffer,   R.   Mulleman,   M.   Dorrestijn,   C.   Severein,   R. Meijer   en   J.   Weijland.   Zijnde   studenten   Hogeschool   van   Arnhem   en   Nijmegen   zijn   zij verantwoordelijk   voor   het   voltooien   van   het   project.

Het   project   is   opgezet   als   opdracht   vanuit   de   HAN.   Dit   proces   wordt   begeleid   door   de   volgende docenten:   mevr.   Danes,   dhr.   Leer   en   dhr.   Holwerda.

#### 1.1. Gerald Bassleer
“Meer   dan   38   jaar   ervaring   in   de   siervissen   industrie   als   bioloog,   vispathobioloog,   eigenaar, directeur,   CEO,   groothandel,   importeur   /   exporteur   van   siervissen,   visgezondheidsmanager, trainer   van   het   aquarium   personeel,   snelle   toepassing   van   microscopisch   onderzoek   en diagnostische   instrumenten,   consultant   voor   verschillende   bedrijven   in   verschillende   landen, auteur,   spreker,   ontwikkelaar   van   Dr.   Bassleers   Biofish   Food   met   Nutrikamenten,   ex-President van   OFI   (Ornamental   Fish   International,   2006-2016).   Publiceerde   app:   Fish   Ziekten   op   iOS   en Android,   alsook   de   nieuwe   e-course   Aquariology   (bij   Global   Pets   Academy).   Momenteel besteedt   hij   veel   tijd   met   reizen   rond   de   wereld   als   ”The   Flying   Fish   Doctor”   en   het   geven   van diensten   aan   de   industrie   om   het   welzijn   en   de   gezondheid   van   siervissen   te   verbeteren.”

(Parafrase   gebaseerd   op   informatie   van   Bassleer.com)

----

## 2. Functional overview
De web-applicatie die word gemaakt zal ervoor moeten zorgen dat de gebruiker, informatie kan vinden over de ziektes van hun vis, zelfstandig een analyse doorlopen om te kijken welke ziekte hun vis zou kunnen hebben, aquarium gegevens bijhouden, een beheersysteem voor de websitebeheerder/consultant, een afspraak maken met een consultant en een gesprek voeren met de consultant.

#### 2.1 Zoeken van informatie over visziektes.
De gebruiker kan op de site van Bassleer een zoek term invoeren in het zoekvenster en het systeem zal vervolgens de zoekresultaten laten zien. Hierna kan de gebruiker door middel van verschillende filters, zoals vissen en ziektes, zijn resultaat verkleinen om specifieker zijn gewenste resultaat weer te geven.

#### 2.2 Analyse tool voor gebruikers met zieke vis(sen).
Dit is een tool in de web-applicatie die ervoor zorgt dat de gebruiker met zieke vis(sen) zelf een analyse kan doorlopen zonder hier contact met een specialist voor hoeft op te nemen. De analyse heeft een vorm van een activity diagram op de achtergrond, dit betekent dat bepaalde vragen een antwoord van de vorige vraag als pre-conditie hebben. Het berekenen van het uiteindelijke resultaat zal gedaan worden d.m.v. een puntensysteem. Voor elk antwoord dat de gebruiker geeft worden punten aan mogelijke ziektes gegeven die de symptomen hebben. Op het einde van de analyse zal vervolgens een top 3,4,5 (onduidelijk op het moment) worden getoond van ziektes waar de gebruiker het beste op scoorde. Bij deze uitkomsten wordt dan vervolgens bijbehorende informatie getoond, zoals de beschrijving van de ziekte, symptomen en een mogelijke behandeling voor de zieke vis.

#### 2.3 Bijhouden van aquarium gegevens.
De gebruiker met vissen en dus een aquarium kan ook zijn aquarium gegevens bijhouden. Gegevens die we hieronder zoal zien zijn, vissen, tempratuur, iron, oxygen. Aangezien verschillende vissen verschillende standaarden hebben voor gegevens als hierboven is het van belang dat de gebruiker op de hoogte word gehouden van mogelijke gevaren. Dit wordt gedaan wanneer de gebruiker een formulier van zijn aquarium waarde in vult en vissen aan zijn digitale aquarium toevoegt. Het systeem zal vervolgens nagaan of de waarden binnen de acceptatie normen liggen. Zo niet dan krijgt de gebruiker een notificatie van de oorzaak van het gevaar en voor welke vis dit van belang is.

#### 2.4 Beheersystemen/CMS.
Nu hebben we het al enkele keren gehad over de verschillende data die het systeem nodig heeft, informatie over vissen, ziektes en hun symptomen/beschrijvingen, analyse punten. Al deze gegevens kunnen beheerd worden in het CMS-gedeelte van de web-applicatie. In dit gedeelte kunnen normale gebruikers niet komen, alleen de consultant/beheerder heeft hier recht op. In het CMS zullen de create, read, update en delete (CRUD) scenarios van verschillende gegevens voor de web-applicatie worden beheerd. Waaronder:
* Vis ziekten (symptomen, beschrijving, behandeling)
* Vis soorten (leefomstandigheden, beschrijving)
* Analyse vragen (pre-conditie, symptomen, afbeelding, post-conditie)
* Notificatie regels (regels)
* Consult afspraken (Wie, wanneer, waarover, bezetting)
* Consulten plannen (Wanneer)

#### 2.5 Inschrijven voor een consult.
Als de gebruiker dit wilt dan kan hij een afspraak maken met een consultant. Hij zal hier een afspraak voor moeten inplannen. De gebruiker kan bij het maken van een afspraak een kleinen beschrijving toevoegen en de datum + tijd kiezen uit een lijst. Deze lijst wordt door de consultant in het beheersysteem gemaakt. Hij kan hier aangeven wanneer hij tijd heeft voor een gesprek. Wanneer de gebruiker zich heeft ingeschreven zal het systeem een mail sturen naar de consultant en het verwerken in het systeem.

#### 2.6 Het consult gesprek.
Het uitvoeren van een consult gesprek gebeurd ook via de web-applicatie. De applicatie krijgt de mogelijkheid om een videochat te starten tussen twee personen, de consultant en de gebruiker met het probleem. Na de inschrijving van het gesprek krijgt de consultant een code die hij kan invoeren in de chat op de afgesproken tijd. De Consultant doet hetzelfde en dit zal een verbinding tot stand brengen tussen beide partijen. Voor gebruikers die geen beschikking hebben over een microfoon zal er een mogelijkheid zijn om met de consultant te chatten d.m.v. tekst. Onder het gesprek is er een mogelijkheid voor zowel de gebruiker als de consultant om media met elkaar te delen.

----

## 3. Quality Attributes
De functionele aspecten of de applicatie zijn in het vorige hoofdstuk (functional overview) beschreven, hier zullen de non-functionele aspecten worden verwoord.
* De web-applicatie is beschikbaar voor alle gebruikers met een browser.
* De web-applicatie word ondersteund voor alle gebruikers met de volgende browsers:
  * Microsoft IE 11+
  * Microsoft Edge 15+
  * Google Chrome 46+
  * Mozilla Firefox 52+
  * Safari 11+
* Het beheersysteem/CMS is alleen beschikbaar voor consultants/beheerders van de website.
* De videochat wordt niet ondersteund met het gebruik van Microsoft IE 11+.
* De code zal volgens de “code conversie” worden geïmplementeerd. Zie Principles, hooftstuk 5.
* Het design is duidelijk geïnspireerd van het voorgaande CMD-groep, met uitzondering van het beheersysteem/CMS.
* Het product word geleverd met een softwareguidebook.

----

## 4. Constraints

Dit hoofdstuk biedt informatie over de beperkingen die zijn opgelegd aan de ontwikkeling van de website bassleer.nl

#### 4.1 Budget

Omdat er geen formeel budget is voor bassleer.nl zijn we beperkt in het gebruiken van modules. Deze modules moeten namelijk open-source zijn.
Voor hosting en dataverkeer moeten kosten gemaakt worden.
Het meest ideale is dat de kosten hiervoor, tijdens ontwikkeling, niet meer bedragen dan 2 euro per maand.

#### 4.2 Technologieën

Voor de website moet er gebruik worden gemaakt van een noSQL database.
De noSQL database die wij gekozen hebben is Google Firebase. Het is niet toegestaan om relationele databases te gebruiken omdat deze niet in het verlengde liggen van de DWA-course.

Naast het gebruik van een noSQL database moet er gebruik gemaakt worden van React.js, Express.js en WebRTC. Voor WebRTC is tevens ook een HTTPS-verbinding nodig.

#### 4.3 Design

Het team is gebonden aan het design dat is aangeleverd door Gerald Bassleer. Deze is gemaakt door CMD studenten aan de Hogeschool van Arnhem en Nijmegen. Aanpassingen aan het design/extra implementaties kunnen plaatsvinden in overleg met de Product owner.

#### 4.4 Ontwikkelmethode

Het team is beperkt in het kiezen van een ontwikkelmethode, er wordt namelijk verwacht dat het team gebruik maakt van Scrum.

#### 4.5 Opleveren
De website moet voor 19-01-2018 worden opgeleverd. Als deze deadline niet gehaald kan worden moet het team vroegtijdig de Product owner op de hoogte brengen.

----

## 5. Principles

In dit hoofdstuk worden de software principles toegelicht. Software principles zijn regels waaraan ieder groepslid zich moet houden om elkaars code te begrijpen. Groeps principles zijn regels om ervoor te zorgen dat het project optimaal verloopt.

#### 5.1 Code principles
**Algemeen**
1. Gebruik tabs, geen spaties,
2. Altijd spaties rondom operators ( = + - * / ),
3. Statements beëindigen met puntkomma’s,
4. Wanneer mogelijk niet meer dan 120 karakters op een regel.

**Control structures**
1. Spatie voor haakje openen,
2. Normale strings declaraties worden aangegeven met enkele quote(‘) ipv dubbele quote(“).

**Benamingen**
1. Alle namen starten met een letter uit het Nederlandse alfabet,
2. meerdere woorden komen aan elkaar door middel van camelCasing (met uizondering van klassen).

**Functies**
1. Camel casing (functionName),
2. Accolade aan het einde van de eerste regel,
3. Spatie voor accolade,
4. Beëindigings accolade op nieuwe regel.

**Klassen**
1. Klassen namen maken gebruik van Pascal case (ClassName).

**Variabelen**
1. Maak variable altijd aan met const of let gebruik geen var.

**Objecten**
Objecten worden als volgt gedefineerd:
```javascript
const person = {
	firstName: "John",
	lastName: "Doe",
	age: 50,
	eyeColor: "blue"
};
```

Wanneer het niet zeker is hoe de code gestyled moet worden, kijk dan naar dit document: 
https://google.github.io/styleguide/jsguide.html

#### 5.2 Groeps principles

1. Werktijden zijn van 8:45 tot 16:45,
2. Er wordt gewerkt op de Hogeschool van Arnhem en Nijmegen,
3. De dagelijkse scrum meeting vindt plaats om 9:30,
4. Men heeft een half uur pauze van 12:00 uur tot 12:30 uur. Dit kan afwijken i.v.m. andere
afspraken op die dag,
5. Men zet in de gezamenlijke kalender wanneer men niet of anders aanwezig is dan
eerder afgesproken,
6. Elke teamgenoot mag niet meer dan twee items in progress hebben,
7. Elke teamgenoot wordt geacht het Scrum-bord bij te houden,
8. Inhoudelijke meldingen worden gedaan via Slack in het daarvoor bestemde kanaal.
9. Whatsapp wordt gebruikt voor informele of vlugge mededelingen.

----

## 6. Software architectuur
Dit hoofdstuk laat een overzicht zien van onze software architectuur.

#### 6.1 Overzicht
Hieronder staat een overzicht van de componenten waaruit ons product is opgebouwd en welke technieken daarbij gebruikt worden. De componenten worden daaronder kort beschreven.

![Diagram](images/software-architecture-1.png)

* **Web applicatie:** Een React applicatie waar elke bezoeker terecht komt.
* **Admin applicatie:** Een deel van de React applicatie waar de adminstrator de content voor de applicatie kan beheren, en geplande consults kan beheren en starten.
* **Chat:** Een deel van de WebApplicatie die d.m.v. WebRTC een realtime peer to peer verbinding tussen een consultant en een geregistreerde gebruiker opzet. Hier kan gebruik worden gemaakt van videochat, tekstchat en het versturen van foto's.
* **Tekst chat log:** Een Firebase realtime database waar de tekst wordt gelogd.
* **Content Management REST API:** Een Express applicatie waar (met uitzondering van chat) al het dataverkeer afgehandeld wordt.
* **Database:** Firestore database waar alle gebruikersinformatie en applicatiecontent wordt bewaard en opgehaald.
* **Bestandssysteem:** Firebase Cloud Storage waar alle afbeeldingen worden opgeslagen.

#### 6.2 Web Applicatie
Hieronder staat een sitemap van de Web Applicatie, inclusief het administratieve gedeelte.

![Diagram](images/software-architecture-2.png)

----

[External Interfaces hier]

----

[Code hier]

----

[Data hier]

----

## 10. Infrastructure Architecture

Dit hoofdstuk bevat informatie over de infrastructuur van de website.

#### 10.1 Live omgeving

De live omgeving is niet heel erg complex; het is namelijk een enkele cloud server gehost door Google's Firebase:
Opzet: https://firebase.google.com/docs/web/setup#host_your_web_app_using_firebase_hosting
Systeem: Node 8.9.1 LTS
Type: cloud server

#### 10.2 Development omgeving

Voor de development wordt er gebruik gemaakt van GitHub. In de 'development' branch worden alle elementen geplaatst, na een sprint review wordt deze branch gekopieerd naar de 'master'. De 'master' branch is altijd de laatste versie en is te zien op bassleer.nl.

#### 10.3 Infrastructure diagram
Op de onderstaande diagram is te zien hoe de communicatie vanuit Firebase naar de server en de client verloopt.

![Diagram](images/infrastructureDiagram.png)

#### 10.4 STUN-server
De STUN (Simple Traversal of User Datagram Protocol [UDP] Through Network Address Translators [NAT’s]) server wordt gebruikt voor communicatie via webRTC. WebRTC wordt gebruikt in tijdens chatsessies. De STUN-server die gebruikt wordt word aangeleverd door google.

Een STUN server stelt NAT-clients (computers achter een firewall) in staat om telefoongesprekken op te zetten met een VOIP-provider buiten het lokale netwerk.
(Bron: https://www.3cx.nl/voip-sip/stun-server/)

#### 10.5 Sidenotes
Google Firebase is verantwoordelijk voor het updaten en onderhouden van de servers. Dhr. Bassleer is verantwoordelijk voor het maken van back-ups, de resources zijn staan ook op naam van Dhr. Bassleer.

----

[Deployment hier]

----

## 12. Operation and Support
In dit hoofdstuk wordt uitgelegd hoe de site kan worden onderhouden en hoe alles moet worden opgestart.

#### 12.1 React
De website is gemaakt met React. Om de site te draaien op een web-server moet je een "production build" maken van het React project. Dit doe je door het volgende commando te gebruiken:

```npm run build```

In de hoofdmap van het React project komt een mapje genaamd "build" te staan. Hierin zitten alle benodigde bestanden om de site te draaien op een web-server. Alle javascript bestanden zijn hierbij samengevoegd in een groot javascript bestand.

Om de site lokaal te draaien voor development kan je het volgende commando gebruiken:

```npm start```

Nadat je dit commando hebt uitgevoerd wordt er in je browser een tab geopend waarop de site te zien is. Als je, terwijl de development server draait, een wijziging maakt in de code dan wordt dit direct gewijzigd op de site. Je hoeft hiervoor niet de site opnieuw te laden.

#### 12.2 Firebase
Voor zaken die te maken hebben met het opslaan van gegevens wordt er gebruik gemaakt van Google's Firebase. Firebase kan je lokaal en op de servers van Firebase zelf laten draaien. Tevens biedt Firebase ook de mogelijkheid om gratis de site te hosten.

Om Firebase te kunnen gebruiken moet je de Firebase CLI installeren op je computer.

[https://firebase.google.com/docs/cli/](https://firebase.google.com/docs/cli/)

Om Firebase lokaal te draaien gebruik je het volgende commando:

```firebase serve --only hosting,functions```

Om de bestanden van Firebase online te zetten gebruik je:

``` firebase deploy --only hosting,functions```

----

[Decision Log hier]
