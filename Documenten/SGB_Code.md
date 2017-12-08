## Operation and Support
In dit hoofdstuk wordt uit gelegd hoe de site kan worden onderhouden en hoe alles moet worden opgestart.

### React
De website is gemaakt met React. Om de site te draaien op een web server moet je een production build maken van het react project. Dit doe je door het volgende commando te gebruiken:

```npm run build```

In de hoofdmap van het react project komt een mapje genaamd "build" te staan. Hierin zitten alle benodigde bestanden om de site te draaien op een web server. Alle javascript bestanden zijn hierbij samen gevoegd in een groot javascript bestand.

Om de site lokaal te draaien voor development kan je het volgende commando gebruiken:

```npm start```

Nadat je dit commando hebt uitgevoerd wordt er in je browser een tab geopend waarop de site te zien is. Als je terwijl de development server draait een wijziging maakt in de code dan wordt dit direct geweizigd op de site. Je hoeft hiervoor dus niet de site opnieuw te laden.

### Firebase
Voor zaken die te maken hebben met het opslaan van gegevens wordt er gebruik gemaakt van Google's Firebase. Firebase kan je lokaal en op de servers van Firebase zelf laten draaien. Tevens bied Firebase ook de mogelijkheid om gratis de site te hosten. 

Om Firebase te kunnen gebruiken moet je de Firebase CLI installeren op je computer.

[https://firebase.google.com/docs/cli/](https://firebase.google.com/docs/cli/)

Om Firebase lokaal te draaien gebruik je het volgende commando:

```firebase serve --only hosting,functions```

Om de bestanden van Firebase online te zetten gebruik je:

``` firebase deploy --only hosting,functions```
