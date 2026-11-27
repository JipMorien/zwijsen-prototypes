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

De demo "Leesplein (dummy)" laat dit zien met één les en één toets. Bovenaan staat een aparte demobalk met "+1 schooldag", "Opnieuw" en de laatste events.

Pagi leest nooit de inhoud van de pagina. Hij krijgt alleen events en zoekt het element met `data-pagi-perch="reading"` op om te weten waar hij moet zitten.

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

In een React-app kun je ook `mountPagi()` uit `src/pagi` aanroepen.

## Events
Een app praat met Pagi via `window.Pagi.emit(type, payload)`.

| type | payload | wat Pagi doet |
| --- | --- | --- |
| `view_changed` | `{ view: "overview" \| "reading" \| "toets" }` | Kiest zijn plek |
| `page_opened` | – | Start de leestimer |
| `page_read` | – | Binnen 4 seconden: niets. Anders +1 woordbrokje en energie +10, en hij wordt wakker als hij sliep |
| `structure_question` | `{ question, signal }` | Stelt de vraag |
| `evidence_found` | `{ signal }` | +1 ster, blij +10, springt van blijdschap |
| `evidence_missed` | `{ signal }` | Geeft een tip; er gaat niets verloren |
| `quiet` | `{ on: boolean }` | Verbergt zich of komt terug |
| `demo_day` | – | Alleen voor de demo: één schooldag verval |
| `demo_reset` | – | Alleen voor de demo: terug naar het begin |

## Afhankelijkheden
- `react` en `react-dom`: Pagi en de demo zijn in React gemaakt.
- `lucide-react`: het kruisje om het paneel te sluiten.
- `@fontsource/atkinson-hyperlegible`, `@fontsource/baloo-2` en `@fontsource/nunito`: de lettertypen van de demo, zonder ze van internet te laden.

## Bevindingen
_Nog in te vullen na testen._
