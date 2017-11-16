# Database ontwerp.

## login gegevens.

Om in te loggen gebruikt de user meerdere data types. Deze worden gevalideerd in de database van de geregistreerde gebruiker data. 
Om op de website in te loggen heeft de gebruiker twee datatypen nodig, een e-mail en een wachtwoord.

| Field name    | Type          | Unique | Required | Default |
| ------------- |:-------------:| :-----:|:--------:|--------:|
| UID           | String        | yes    | yes      |         |
| Email         | String        | yes    | yes      |         |
| Password      | String        | no     | yes      |         |


## Gebruikersgegevens

Bij het registreren van de gebruiker wordt er gevraagd naar persoonlijke gegevens zoals voornaam, achternaam en woonplaats. 
Dit omdat het voor de consultant fijn is om te weten met wie hij/zij spreekt en waar de gebruiker vandaan komt.

Ook zijn er gegevens die worden toegevoegd zonder dat de gebruiker hier idee van heeft. 
Dit is de rol van de gebruiker binnen de site. 
De role wordt gebruikt om aan te geven of de persoon die inlogt een beheerder of een gebruiker is, mogelijk zou consultant hier ook nog bij kunnen.

| Field name    | Type          | Unique | Required | Default |
| ------------- |:-------------:| :-----:|:--------:|--------:|
| UID           | String        | yes    | yes      |         |
| Firstname     | String        | no     | yes      |         |
| Surname       | String        | no     | yes      |         |
| Country       | String        | no     | yes      |         |
| Email         | String        | yes    | yes      |         |
| Role          | String        | no     | yes      | user    |


## Landen

We houden de landen bij in een losse database collection. 
Deze zullen we gebruiken bij het registreren van een gebruiker en het veranderen van gebruikersgegevens. 
We hebben ervoor gekozen om zowel de land code als de landnaam op te slaan voor mogelijke uitbreidingen in de applicatie. 
Deze database collection heeft geen connectie of references met andere database collections.

| Field name    | Type          | Unique | Required | Default |
| ------------- |:-------------:| :-----:|:--------:|--------:|
| UID           | String        | yes    | yes      |         |
| Name          | String        | yes    | yes      |         |
| Code          | String        | yes    | yes      |         |


## Aquarium gegevens

Zodra een gebruiker een aquarium wilt invoeren zal deze eerst moeten worden aangemaakt. 
Bij het aanmaken van het aquarium zijn alle velden leeg, behalve de UID. 
De UID van het aquarium  zal worden gekoppeld aan de UID van de gebruiker. 

Wanneer de gebruiker zijn waarde voor het aquarium invult zullen de andere velden ook worden gevuld.


| Field name    | Type          | Unique | Required | Default |
| ------------- |:-------------:| :-----:|:--------:|--------:|
| UID           | String        | yes    | yes      |         |
| UserUID       | String        | yes    | yes      |         |
| Phosphate     | Integer       | no     | no       |         |
| Nitrate       | Integer       | no     | no       |         |
| Nitrite       | Integer       | no     | no       |         |
| Iron          | Integer       | no     | no       |         |
| gH            | Integer       | no     | no       |         |
| Temperature   | Integer       | no     | no       |         |
| Oxygen        | Integer       | no     | no       |         |
| Carbon        | Integer       | no     | no       |         |
| Dioxide       | Integer       | no     | no       |         |
| kH            | Integer       | no     | no       |         |
| Chlorine      | Integer       | no     | no       |         |
