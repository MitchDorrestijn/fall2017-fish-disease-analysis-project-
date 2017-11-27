# Firebase 101
Door Mitch Dorrestijn.

## Starten met FireBase

*Ik ga ervanuit dat je al een demo project gemaakt hebt met create-react-app*.

Om te starten met FireBase maak je een account aan op firebase.google.com. Vervolgens klik je op het menuitem *‘console’* en maak je een nieuw project aan.

Om te biginnen met oefenen moet je de read/write regels aanpassen zodat je overal toegang tot hebt. Hiervoor klik je in de sidebar op *Database->Aan de slag->Regels*.

Hier zie je de volgende code:
```javascript
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
Deze moet je veranderen in:

```javascript
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Vervolgens klik je op de knop *'publiceren'*. Je krijgt een waarschuwing maar die kun je voor nu even negeren.

Start vervolgens de terminal op en navigeer naar je demo project die je gemaakt hebt met create-react-app. Hierin run je het commando `npm install firebase@4.2.0`.

Ga vervolgens naar je react app en maak een nieuw mapje aan in `src` genaamt `firebase`. In deze map maak je een bestandje genaamd `firebase.js`.

In `firebase.js` importeer je Firebase door de volgende code toe te voegen:
```javascript
import * as firebase from 'firebase'
```

Ga vervolgens terug naar de homepagina op de Firebase website en klik op *'Firebase toevoegen aan uw webapp'*. Er verschijnt een stuk code, hiervan plak je de content van de variable config in `firebase.js`. Het type *var* kun je veranderen naar een *const*.
Vervolgens kopieer en plak je ook de regel `firebase.initializeApp(config);` in `firebase.js`. Je `firebase.js` bestand ziet er nu zo uit:

```javascript
import * as firebase from 'firebase'

const config = {
	 apiKey: "4TRRzaSyBr_TFY3G2HC67bfsdfds897edfsdfKfGZY",
	 authDomain: "learning-firebase-28755.firebaseapp.com",
	 databaseURL: "https://learning-firebase-28755.firebaseio.com",
	 projectId: "learning-firebase-28755",
	 storageBucket: "learning-firebase-28755.appspot.com",
	 messagingSenderId: "3264832754327659"
 };

 firebase.initializeApp(config);
```

Om de connectie te testen plak je onderaan `firebase.js` de volgende regel:

```javascript
firebase.database().ref().set({
	name: 'Mitch'
});
```

Vervolgens ga je naar `index.js` en importeer je `firebase.js`. Run vervolgens je app en navigeer je naar `localhost:3000`. Als je geen errors in de console krijgt ga je naar je Firebase dashboard, vervolgens klik je op `dashboard` en zie je een resultaat.

## Data schrijven
Firebase ondersteunt alle objecttypes die je ook in Javascript kunt gebruiken (zoals nummers, Strings etc).

Om dit te testen voegen we een aantal key/values toe aan ons set object.

```javascript
firebase.database().ref().set({
	name: 'Mitch',
	age: 21,
	hasFishes: false,
	location: {
		city: 'Zwolle',
		country: 'The Netherlands'
	}
});
```

Als je je bestand opslaat en snel naar je Firebase console gaat zie je dat de data live wordt toegevoegd.

laten we nu eens gaan kijken naar de volgende regel:
`firebase.database().ref().set({`
Firebase heeft niet alleen een database maar ook een functie feature, test-lab, authentication etc. We kunnen de database features aanroepen met de regel `firebase.database()`, als we de authentication feature willen aanroepen kunnen we `firebase.auth()` gebruiken.

we kunnen `firebase.database()` ook in een `const` variable zetten met als naam 'database'.

`.ref()` is voor de root van de database, als we onder onze bestaande code nog een een keer `database.ref()` aanroepen, zoals:

```Javascript
database.ref().set({
	age: 22
});
```
Zou je zien dat alle data die in de database zat er niet meer instaat, behalve age:22.

Als we wel iets willen updaten in de database zonder alles te overschrijven dan kunnen we een parameter meegeven aan `.ref()`. Zo kunnen we `age` veranderen naar 22 via de parameter:
```Javascript
database.ref('age').set(22);
```

In dit geval gingen we maar 1 niveau diep.
Maar wat als we `city` of `country` willen veranderen moeten we dat op de volgende manier doen:
```Javascript
database.ref('location/city').set('Zwolle');
```

## Data verwijderen

Tot op heden hebben we alleen gezien hoe je de hele database verwijdert en alles weer insert met een eventuele ge-update waarde.

Als we 1 item willen verwijderen dan kunnen we dat doen door de `remove()` functie aan te roepen. Hieronder verwijder ik het item `hasFishes`.

```javascript
database.ref('hasFishes').remove();
```
We kunnen hiervoor ook prommises gebruiken. Dit is gebruikelijk als je werkt met een NoSQL database:

```Javascript
database.ref('hasFishes')
	.remove()
	.then(() => {
		console.log('Data was removed');
	}).catch((e) => {
		console.log('Did not remove data', e);
	});
```
We kunnen ook items verwijderen door `set` te gebruiken:

```Javascript
database.ref('hasFishes').set(null);
```

Toch is het beter om `remove` te gebruiken omdat dit speciaal gemaakt is om items te verwijderen.

## Data updaten
Om data uit de database te updaten gebruiken we de `update()` functie.
De update functie verwacht een object.
Al we `name` en `age` willen updaten dan doen we dat zo:

```Javascript
database.ref().update({
	name: 'Fred',
	age: 25
});
```
We kunnen ook nieuwe objecten toevoegen aan de collectie met `update()`.
Hieronder voeg ik het object `job` toe en haal ik `hasFishes` weg:

```Javascript
database.ref().update({
	name: 'Fred',
	age: 25,
	job: 'Front-end web developer',
	hasFishes: null
});
```

Updaten gebeurd alleen op root-niveau. Dit houdt in dat als we `city` willen updaten de `county` wordt verwijderd.

```javascript
database.ref().update({
	age: 22,
	location: {
		city: 'Groningen'
		//country: 'The Netherlands' is nu weg omdat het volledige location object ge-update word.
	}
});
```

Als we dit willen voorkomen moeten we de volgende syntax gebruiken:
```javascript
database.ref().update({
	age: 22,
	'location/city': 'Groningen'
});
```

## Data fetchen

Omdat we al data in de database hebben staan is het niet nodig om nog dingen toe te voegen/ te verwijderen. Daarom kun je de CRUD queries even uit commenten.

Om data uit de database te tonen op de website gebruiken we de `once()` functie. Deze functie fetcht de data 1 keer. Deze functie gebruik je zo:

```javascript
database.ref()
	.once('value')
	.then((snapshot) => {
		const val = snapshot.val();
		console.log(val);
	})
	.catch((e) => {
		console.log('Error fetching data', e);
	});
```

In de console staat nu de complete JSON data array.
Als je iets specifieks wil fetchen kunnen we gebruik maken van de `/`. Hieronder fetch ik alleen de city:

```javascript
database.ref('location/city')
	.once('value')
	.then((snapshot) => {
		const val = snapshot.val();
		console.log(val);
	})
	.catch((e) => {
		console.log('Error fetching data', e);
	});
```

Als de data update in de database wordt het niet gelijk op de pagina ge-refreshed. Dit komt omdat de prommise al uitgevoerd is. Om dit tegen te gaan moeten we dit zonder prommises doen, dat kan zo:

```javascript
database.ref().on('value', (snapshot) => {
	console.log(snapshot.val());
});
```

Om bepaalde onderdelen te printen kunnen we onze code zo schrijven:
```javascript
database.ref().on('value', (snapshot) => {
	const val = snapshot.val();
	console.log(`${val.name} is ${val.age} years old and lives in ${val.location.city}.`);
});
```

Dit print 'Mitch is 21 years old and lives in Zwolle.'.

## Array data

Firebase heeft GEEN ondersteuning voor array's. Laten we eens een paar notities toevoegen aan de database om dit te laten zien.

```javascript
const notes = [{
		id: '1',
		title: 'First note!',
		body: 'This is my note'
	}, {
		id: '2',
		title: 'Second note!',
		body: 'This is my note'
	}
]

database.ref('notes').set(notes);
```

Als je dit in de firebase toevoegd wordt het gezien als een object-like-structure, namelijk:

`notes
-0
|
	--body: 'this is my note'
	--id: '1'
	--title: 'First note!'
|
-1
	--body: 'this is my note'
	--id: '2'
	--title: 'Second note!'`

	Tot zover!
	Bron: https://firebase.google.com/docs/web/setup
