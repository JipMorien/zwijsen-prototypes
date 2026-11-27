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

## Pagi v1
Pagi is het leeshuisdier. Hij leeft als widget bovenop een bestaande leesapp en kent alleen de kernlus: lezen, begrijpen, verdienen, verzorgen. Hij gaat nooit dood en straft niet.

Wat v1 doet:
- Pagi heeft drie stemmingen: blij, honger en slaapt. Hij praat via een tekstballon.
- Hij heeft drie behoeften (honger, energie, blij) van 0 tot 100.
- Een gelezen pagina telt pas na minstens 4 seconden. Dan krijgt de leerling een woordbrokje en krijgt Pagi energie. Te snel doorklikken levert niets op.
- In de speurtocht tikt de leerling de zin aan waarin het antwoord staat. Goed geeft een ster en een sprongetje. Fout geeft een hint met het signaalwoord; er gaat niets verloren.
- Klik op Pagi om het paneel te openen: woordbrokjes, sterren, de drie behoeften en de knoppen Voeren (kost een woordbrokje) en Aaien. Escape sluit het paneel.
- Als de behoeften te laag worden, valt Pagi in slaap. Eén gelezen pagina maakt hem weer wakker.
- Tijdens het lezen zit Pagi op de bovenrand van de tekst. Op andere schermen, als het paneel open is of als de tekst weggescrolld is, staat hij rechtsonder.
- Tijdens een toets is Pagi verborgen.
- De voortgang staat in `localStorage` onder `pagi-state-v1`. Als opslag geblokkeerd is, werkt Pagi gewoon zonder.

Pagi leest nooit de inhoud van de pagina. Hij krijgt alleen events en zoekt het element met `data-pagi-perch="reading"` op om te weten waar hij moet zitten.

## Starten
Nodig: Node.js 22.12 of nieuwer.

```sh
npm install
npx playwright install chromium   # eenmalig, voor npm run e2e
npm run dev                       # demo op http://localhost:5173
```

| Opdracht | Wat het doet |
| --- | --- |
| `npm run dev` | Start de demo "Leesplein (dummy)" met één les en één toets |
| `npm run build` | Bouwt de demo naar `dist/demo/` |
| `npm run build:widget` | Bouwt het losse script `dist/pagi-widget.js` |
| `npm test` | Unittests van de spelregels (Vitest) |
| `npm run e2e` | Speelt de hele kernlus door in een browser (Playwright) |
| `npm run lint` | ESLint, nul waarschuwingen toegestaan |

De demo heeft onderaan een aparte ontwikkelbalk met "+1 schooldag" (één dag verval), "Opnieuw" (terug naar de beginstand) en een lijst van de laatst verstuurde events.

## Inbouwen
**Met één scripttag**, in elke pagina zonder React. Zet de tag in `<body>`; dan bestaat `Pagi` meteen voor de scripts erna. In `<head>` verschijnt Pagi pas als de pagina geladen is.

```html
<script src="pagi-widget.js"></script>
<script>
  Pagi.emit("view_changed", { view: "reading" });
</script>
```

`examples/plain.html` is zo'n pagina, met opzet met lelijke pagina-CSS om te laten zien dat Pagi daar geen last van heeft. Draai eerst `npm run build:widget` en open het bestand dan in de browser.

**In een React-app** importeer je `mountPagi` uit `src/pagi`:

```ts
import { mountPagi } from "./pagi";

const unmount = mountPagi();
window.Pagi?.emit("page_opened");
```

`mountPagi({ storage })` accepteert een eigen opslag met `load()` en `save(state)` in plaats van `localStorage`.

In beide gevallen zit Pagi in een eigen shadow root, zodat de CSS van de pagina en die van Pagi elkaar niet raken.

## Events
De app praat met Pagi via `window.Pagi.emit(type, payload)`. Dat stuurt een `CustomEvent` met de naam `pagi` op `window`. Een app kan dat event ook zelf versturen; `detail` mag dan een JSON-string of een object zijn, in de vorm `{ type, ...payload }`. Events die niet kloppen worden genegeerd.

| type | payload | effect |
| --- | --- | --- |
| `view_changed` | `{ view: "overview" \| "reading" \| "toets" }` | Pagi kiest zijn plek |
| `page_opened` | – | Start de leestimer |
| `page_read` | – | Binnen 4 s na `page_opened`: niets, Pagi zegt dat het te snel ging. Anders: +1 woordbrokje, energie +10, en Pagi wordt wakker als hij sliep |
| `structure_question` | `{ question, signal }` | Pagi stelt de vraag |
| `evidence_found` | `{ signal }` | +1 ster, blij +10, sprongetje, Pagi noemt het signaalwoord |
| `evidence_missed` | `{ signal }` | Hint met het signaalwoord; er gaat niets verloren |
| `quiet` | `{ on: boolean }` | Verbergt of toont Pagi |
| `demo_day` | – | Alleen voor de demo: één schooldag verval |
| `demo_reset` | – | Alleen voor de demo: terug naar de beginstand |

## Getallen
Alle getallen staan in `src/pagi/config.ts`, alles wat Pagi zegt in `src/pagi/copy.ts`.

| Wat | Waarde |
| --- | --- |
| Beginstand | honger 45, energie 55, blij 70, 2 woordbrokjes, 0 sterren |
| Minimale leestijd per pagina | 4 s |
| Honger-gezicht onder | honger 50 |
| In slaap als het gemiddelde van de drie behoeften lager is dan | 8 |
| Verval per schooldag | honger −25, energie −30, blij −15 |
| Voeren | −1 woordbrokje, honger +20 |
| Aaien | blij +3 |
| Tekstballon zichtbaar | 7 s |

## Mappen
- `src/pagi/` is de widget. `reducer.ts` bevat de spelregels als pure functie; de componenten staan in `components/`.
- `src/demo/` is de nep-leesapp. Die praat alleen via `window.Pagi.emit` met Pagi, net als een echte app.
- `e2e/` is de Playwright-test van de kernlus.

## Bevindingen
_Nog in te vullen na testen._
