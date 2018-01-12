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







## Beheerssysteem/CMS
Het berheerssysteem, of control management system, kan worden gebruikt om gegevens op de site aan te passen. Het redelijk duidelijk te snappen, maar er is voor elke pagina een kopje gemaakt om het wat beter toe te lichten. Alle invoervelden moeten ingevuld worden in elke edit/add mogelijkheid van de pagina's. Word dit niet gedaan is dat geen ramp, de applicatie zal dan een error geven en de record nog niet aanmaken.

### Vissoorten beheren.
De vissoorten die je op deze pagina kan beheren worden gebruikt in de volgende onderdelen van de applicaite:
* Gebruikers kunnen zoeken naar vissoorten voor informatie hierover.
* Gebruikers kunnen vissoorten aan hen aquarium toevoegen.

In de "edit" column staan drie icoontjes waarop geklikt kan worden. Het kruisje in dit veld geeft de gebruiker de mogelijkheid om de record te verwijderen, er word eerst om bevestiging gevraagt. Het icoontje met de vierkant en de pen geeft de gebruiker de mogelijkheid om de record te wijzigen, buiten de afbeelding om. Het icoontje met het schilderijtje geeft de gebruiker de mogelijkheid een afbeelding toe te voegen/te wijzigen van de record.

Onderin de pagina staat een knop genaamd "Add fish". Deze zorgt ervoor dat er een nieuwe vissoort kan worden toegevoegd. Na het aanmaken van een nieuwe vissoort is er nog geen afbeelding aan de record gevoegd.

Deze pagina bevat een zoekbalk. Waarmee de gebruiker snel kan navigeren binnen de pagina.
### foto

### Vis ziektes beheren.
De vis ziektes die je op deze pagina kan beheren worden gebruikt in de volgende onderdelen van de applicatie:
* Gebruikers kunnen zoeken naar ziektes voor informatie hierover.
* Ziektes zijn de eindresultaten na een analyse.

In de "edit" column staan drie icoontjes waarop geklikt kan worden. Het kruisje in dit veld geeft de gebruiker de mogelijkheid om de record te verwijderen, er word eerst om bevestiging gevraagt. Het icoontje met de vierkant en de pen geeft de gebruiker de mogelijkheid om de record te wijzigen, buiten de afbeelding om. Het icoontje met het schilderijtje geeft de gebruiker de mogelijkheid een afbeelding toe te voegen/te wijzigen van de record.

Onderin de pagina staat een knop genaamd "Add fish disease". Deze zorgt ervoor dat er een nieuwe vis ziekte kan worden toegevoegd. Na het aanmaken van een nieuwe vis ziekte is er nog geen afbeelding aan de record gevoegd.

Deze pagina bevat een zoekbalk. Waarmee de gebruiker snel kan navigeren binnen de pagina.
### foto

### Afspraken beheren.
De afspraken die je op deze pagina kan beheren worden gebruikt in de volgende onderdelen van de applicatie:
* De request consult sectie voor de gebruikers in hun dashboard.
* Chat functionaliteiten.

Appointments worden gemaakt door de normale geregistreerde gebruiker, door een open tijdslot te bezetten. Dit is de reden waarom de consultant geen appointments hoeft toe te voegen.
### foto

### Tijdsloten beheren.
De tijdsloten die je op deze pagina kan beheren worden gebruikt in de volgende onderdelen van de applicatie:
* De request consult sectie voor de gebruikers in hun dashboard.

In de "edit" Column staan twee iccontjes waarop geklikt kan worden. Het kruisje in dit veld geeft de gebruiker de mogelijkheid om de record te verwijderen, er word eerst om bevestiging gevraagt. Het icoontje met de vierkant en de pen geeft de gebruiker de mogelijkheid om de record te wijzigen.

Onderin de pagina staat een knop genaamd "Add timeslot when you are available". Deze zorgt ervoor dat er een nieuwe tijdslot kan worden toegevoegd. Denk eraan dat doormiddel van de start-time en de duration de end time door de applicatie word berekent.
### foto

### Notificatie regels beheren.
De notification regels die je op deze pagina kan beheren worden gebruikt in de volgende onderdelen van de applicatie:
* Word gebruikt bij het triggeren van een notificatie nadat een gebruiker nieuwe data invoerd bij "todaysdata".

In de "edit" Column staan twee icoontjes waarop geklikt kan worden. Het kruisje in dit veld geeft de gebruiker de mogelijkheid om de record te verwijderen, er word eerst om bevestiging gevraagt. Het icoontje met de vierkant en de pen geeft de gebruiker de mogelijkheid om de record te wijzigen.

Onderin de pagina staat een knop genaamd "Add notification rule". Deze zorgt ervoor dat er een nieuwe tijdslot kan worden toegevoegd. Wanneer het invoerveld dan opkomt is er een mogelijkheid om meer dan één trigger voor de regel toe te voegen. Je kan ook triggers weghalen. De applicatie laat niet toe dat er minder dan één trigger aanwezig is.
### foto
