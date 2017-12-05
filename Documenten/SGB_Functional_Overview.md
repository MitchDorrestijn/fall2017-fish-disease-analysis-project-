# 2. Functional overview
De web applicatie die word gemaakt zal ervoor moeten zorgen dat de gebruiker, informatie kan vinden voor de ziektes van hun vis, zelfstandig een analyse doorlopen om te kijken welke ziekte hun vis zou kunnen hebben, aquarium gegevens bijhouden, een beheersysteem voor de websitebeheerder/consultant, een afspraak maken met een consultant en een gesprek voeren met de consultant.

## Zoeken van informatie over visziektes.
De gebruiker kan op de site van Bassleer een zoek term invoeren in het zoekvenster en het systeem zal vervolgens de zoekresultaten laten zien. Hierna kan de gebruiker door middel van verschillende filters, zoals vissen en ziektes, zijn resultaat verkleinen on specifieker zijn gewenste resultaat weer te geven.

## Analyse tool voor gebruikers met zieke vis(sen).
Dit is een tool in de web applicatie die ervoor zorgt dat de gebruiker met zieke vis(sen) zelf een analyse kan doorlopen zonder hier contact met een specialist voor hoeft op te nemen. De analyse heeft een vorm van een activity diagram op de achtergrond, dit betekent dat bepaalde vragen een antwoord van de vorige vraag als pre-conditie hebben. Het berekenen van het uiteindelijke resultaat zal worden gedaan met een punten systeem. Voor elk antwoord dat de gebruiker geeft worden punten aan mogelijke ziektes gegeven die die symptomen hebben. Op het einde van de analyse zal vervolgens een top 3,4,5 (onduidelijk op het moment) worden getoond van ziektes waar de gebruiker het beste op scoorde. Bij deze uitkomsten word dan vervolgens bijbehorende informatie getoond, zoals beschrijving van de ziekte, symptomen en een mogelijke behandeling voor de zieke vis.

## Bijhouden van aquarium gegevens.
De gebruiker met vissen en dus een aquarium kan ook zijn aquarium gegevens bijhouden. Gegevens die we hieronder zoal zien zijn, vissen, tempratuur, iron, oxygen. Aangezien verschillende vissen verschillende standaarden hebben voor gegevens als hierboven is het van belang dat de gebruiker op de hoogte word gehouden van mogelijke gevaren. Dit word gedaan door de gebruiker een formulier van zijn aquarium waarde in te vullen en vissen aan zijn digitale aquarium toe te voegen. Het systeem zal vervolgens nagaan of de waarden binnen de acceptatie normen van de vissen liggen. Zo niet dan krijgt de gebruiker een notificatie van de oorzaak van het gevaar en voor welke vis dit van belang is.

## Beheersystemen/CMS.
Nu hebben we het al enkele keren gehad over de verschillende data die het systeem nodig heeft, informatie over vissen, ziektes en hun symptomen/beschrijvingen, analyse punten. Al deze gegevens zullen kunnen beheerd worden in het CMS gedeelte van de web applicatie. In dit gedeelte kunnen normale gebruikers niet komen, alleen de consultant/beheerder heeft hier recht op. In het CMS zullen de create, read, update en delete (CRUD) scenarios van verschillende gegevens nodig voor de web applicatie worden beheerd. Waaronder:
* Vis ziekten (symptomen, beschrijving, behandeling)
* Vis soorten (leef omstandigheden, beschrijving)
* Analyse vragen (pre-conditie, symptomen, afbeelding, post-conditie)
* Notificatie regels (regels)
* Consult afspraken (Wie, wanneer, waarover, bezetting)
* Consulten plannen (Wanneer)

## Inschrijven voor een consult.
Als de gebruiker dit wilt dan kan hij een afspraak maken met een consultant. Hij zal hier een afspraak voor moeten inplannen. De gebruiker kan bij het maken van een afspraak een kleinen beschrijving toevoegen en de datum + tijd kiezen uit een lijst. Deze lijst word door de consultant in het beheersysteem gemaakt. Hij kan hier aangeven wanneer hij tijd heeft voor een gesprek. Wanneer de gebruiker zich heeft ingeschreven zal het systeem een mail sturen naar de consultant en het verwerken in het systeem, zodat de consultant die kan zien in zijn beheersysteem.

## Het consult gesprek.
Het uitvoeren van een consult gesprek gebeurd ook via de web applicatie. De applicatie krijgt de mogelijkheid om een video chat te starten tussen twee personen, de consultant en de gebruiker met het probleem. Na de inschrijving van het gesprek krijgt de gebruiker een code die hij kan invoeren in de chat op de afgesproken tijd. De Consultant doet hetzelfde en dit zal een verbinding maken met tussen beide partijen. Voor gebruikers die geen beschikking hebben over een microfoon zal er mogelijkheid zijn om het de consultant te chatten d.m.v. tekst. Onder het gesprek is er een mogelijkheid voor zowel de gebruiker als de consultant om media met elkaar te delen.


