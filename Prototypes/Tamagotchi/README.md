# Tamagotchi

## Concept
Een digitaal huisdier dat de leerling verzorgt door te lezen. Het huisdier "eet" en groeit wanneer de leerling teksten leest én laat zien dat die begrepen zijn. Zo wordt dagelijks lezen een gewoonte waar de leerling zelf zin in heeft.

## Kernfunctionaliteiten
- Huisdier krijgt voeding/energie door goed beantwoorde begripsvragen (niet door alleen klikken of tijd)
- Huisdier groeit en ontwikkelt zich naarmate de leerling vooruitgaat
- Uiterlijk en accessoires vrij te spelen
- Mild systeem: het huisdier "verdwijnt" nooit, zodat leerlingen niet afhaken na een gemiste dag

## Onderzoeksvraag
Lezen leerlingen vaker en uit zichzelf wanneer hun leesvoortgang gekoppeld is aan de verzorging van een digitaal huisdier?

## Aandachtspunten
- Beloning moet gekoppeld zijn aan begrip, anders gaan leerlingen skimmen.
- Geen schuldgevoel of straf bij niet lezen.

## Wat het doet
Het huisdier heet Pagi, van "pagina". Hij staat als widget bovenop een leesapp.

- Lees je een pagina rustig (minstens 4 seconden), dan krijg je een woordbrokje.
- Vind je in de speurtocht de zin met het antwoord, dan krijg je een ster.
- Klik op Pagi om hem te voeren of te aaien.
- Lees je een tijd niet, dan valt hij in slaap. Eén gelezen pagina maakt hem weer wakker. Hij gaat nooit dood.
- Tijdens een toets is Pagi verborgen.

De demo "Leesplein (dummy)" laat dit zien met één les en één toets.

## Starten
Nodig: Node.js 22.12 of nieuwer.

```sh
npm install
npm run dev
```

Open daarna http://localhost:5173.

Andere opdrachten:
- `npm test`: tests van de spelregels
- `npm run e2e`: test in de browser (eenmalig eerst `npx playwright install chromium`)
- `npm run build:widget`: maakt `dist/pagi-widget.js`, dat je met één `<script>`-tag op elke pagina zet

## Bevindingen
_Nog in te vullen na testen._
