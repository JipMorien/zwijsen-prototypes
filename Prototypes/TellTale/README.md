# TellTale

## Concept
Interactieve verhalen waarin de leerling keuzes maakt. Bij elke keuze staat in de tekst wat slim is om te doen. Wie goed leest, kiest de keuze die past bij de tekst. Wie dat niet doet, krijgt geen "fout!"-scherm: er gaat iets mis in het verhaal, de hoofdpersoon herstelt zich en het verhaal gaat verder.

Hoe meer keuzes bij de tekst passen, hoe mooier het einde. Alleen wie alle aanwijzingen vindt, krijgt het geheime einde. Zo zit de motivatie in het lezen zelf (feedback van Zwijsen): het verhaal wordt beter doordat je beter leest.

Aan het einde ziet de leerling een terugblik: welke keuzes bij de tekst pasten, en bij gemiste keuzes de zin waar de aanwijzing stond. Elke keuze hoort bij een tekststructuur (oorzaak en gevolg, volgorde, vergelijken, probleem en oplossing).

## Starten
```bash
npm install
npm run dev
```

| Commando | Wat het doet |
|---|---|
| `npm run dev` | Start de app |
| `npm test` | Controleert de verhalen en de logica |
| `npm run build` | Typecheck en productiebuild |

## Een verhaal toevoegen
Verhalen staan in `src/prototype-data/`. Een verhaal bestaat uit delen (`nodes`) van drie soorten:

- `decision`: tekst met een vraag en keuzes. Precies één keuze heeft `fitsText: true`. `clue` is de zin uit de tekst met de aanwijzing, en `structure` de tekststructuur.
- `passage`: tekst met een knop "Lees verder" naar `next`. Hiermee schrijf je wat er gebeurt na een keuze.
- `finale`: het laatste stuk tekst. Daarna kiest de app een einde uit `endings` op basis van hoeveel keuzes bij de tekst pasten (`minScore`).

Voeg het verhaal toe aan `src/prototype-data/stories.ts`. `npm test` controleert of het verhaal klopt: alle verwijzingen bestaan, elke aanwijzing staat letterlijk in de tekst, elke route eindigt, elke route heeft evenveel keuzes en elk einde is bereikbaar.

## Bevindingen
_Nog in te vullen na testen._
