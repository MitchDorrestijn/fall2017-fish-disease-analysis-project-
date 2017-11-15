# FishTool API 

In dit document wordt omschreven welke API-endpoints worden blootgesteld waar de frontend mee kan praten. Deze zullen gecategoriseerd worden functionaliteit (e.g. aquaria, registreren, inloggen, etc.).

API-URL: TODO. In de documentatie wordt de URL vervangen met een tilde (~), e.g. ~/user.

## User Registration
#### Registreer gebruikern
Endpoint om een gebruiker te registreren.

```sh
~/register/
```

##### Vereisten
Geen login state vereist. TODO: Iets waardoor iemand niet oneindig vaak gebruikers kan registreren.

##### POST
Praat hier tegenaan om een gebruiker te registreren. Geef de volgende JSON mee:

```json
{
    user: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        country: // DocumentReference naar country
    }
}
```

## Species
#### Gegevens van een enkele species
Hieronder de endpoints behorende by species.

```sh
~/species/{id}
```

##### Vereisten
Gebruiker is moet toegang hebben tot de API van FishTool. Kan zijn dat iedereen toegang heeft.
##### GET
Een enkele species wordt getoond.
Return JSON:

```json
{
    data: {
        species: {
            id: 123,
            minSize: 10,
            maxSize: 20,
            familiyName: "Visus Supremus",
            foodPreference: "Meat",
            kind: "soortvis"
        }
    }
}
```

#### Gegevens van alle species
Hieronder de endpoints behorende by species.

```sh
~/species
```

##### Vereisten
Gebruiker is moet toegang hebben tot de API van FishTool. Kan zijn dat iedereen toegang heeft.
##### GET
Alle species worden getoond.
Return JSON:

```json
{
    data: {
        species: [{
            // Dezelfde data als een enkele species.
        }]
    }
}
```
## Users
#### Gegevens van huidige user
De onderstaande endpoints zorgen voor het invullen en wijzigen van gegevens van aquaria.

```sh
~/user
```
##### Vereisten
Gebruiker is ingelogd.
##### GET
De huidige gebruiker wordt gereturnd.
Return JSON:

```json
{
    data: {
        user: {
            id: 123,
            firstName: "Jaap",
            lastName: "Weijland",
            email: "mail@adres.nl",
            address: "Straatnaam 27, 5123AB Nijmegen",
            zip: "",
            country: {
                name: "Nederland"
            },
            role: {
                name: "admin"
            }
        }
    }
}
```

##### POST
Hier gebeurt iets

## Aquaria
#### Gegevens van aquaria van een user
De gegevens van alle aquaria van een bepaalde user.
```sh
~/user/aquaria
```
##### Vereisten
Gebruiker is ingelogd.
##### GET
De huidige gebruiker wordt gereturnd.
Return JSON:

```json
{
    data: {
        aquaria: [{
            id: 123,
            name: "Bak 1"
        }]
    }
}
```
##### POST
Het aanmaken van een nieuw aquarium.
Return JSON:

```json
// Todo
```

#### Gegevens van een enkel aquarium
De gegevens van een bepaald aquarium van een bepaalde user.

```sh
~/aquaria/{id}
```
##### Vereisten
Gebruiker is bevoegd om het aquarium te bekijken.
##### GET
Een enkel aquarium wordt gereturnd.
Return JSON:

```json
{
    data: {
        aquarium: {
            id: 123,
            name: "Bak1"
        }
    }
}
```

#### POST
Aquarium wordt geupdatet.
Return JSON:

```json
{
    data: {
        result: {
            success: true // Of false, wanneer
        }
    }
}
```

## Diaries
#### Gegevens van alle entries van een diary in een enkel aquarium
Alle entries van de diary van een aquarium.
```sh
~/aquaria/{id}/diary
```
##### Vereisten
Gebruiker is bevoegd om het aquarium te bekijken.
##### GET
Alle entries van de diary van een aquarium worden getoond.
```json
{
    data: {
        entries: [{
            id: 123,
            date: 1234566, // Milliseconds
            description: "Omschrijving komt hier...",
            brand: "",
            amount: 0,
            added: false,
            sex: "m",
            liters: 2526,
            PH: 9.0,
            KH: 2.3,
            GH: 2.3,
            CL: 1.2,
            NH3: 5.5,
            NO2: 4.4,
            NO3: 2.2,
            PO4: 6.7,
            O2: 4.4,
            Temp: 34.5,
            IsSalt: false
        }]
    }
}
```

#### Gegevens van species behorende bij een entry
Gegevens van species behorende bij een entry
```sh
~/aquaria/{id}/diary/{entryId}/species
```
##### Vereisten
Gebruiker is bevoegd om het aquarium te bekijken.
##### GET
Alle species van de entry worden getoond.
```json
{
    data: {
        species: [{
            // Dezelfde data als een enkele species.
        }]
    }
}
```
