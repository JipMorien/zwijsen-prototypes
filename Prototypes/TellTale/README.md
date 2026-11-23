# TellTale

## Concept
Interactieve verhalen waarin de leerling keuzes maakt. Bij elke keuze staat in de tekst wat slim is om te doen. Wie goed leest, kiest de keuze die past bij de tekst. Wie dat niet doet, krijgt geen "fout!"-scherm: er gaat iets mis in het verhaal, de hoofdpersoon herstelt zich en het verhaal gaat verder.

Hoe meer keuzes bij de tekst passen, hoe mooier het einde. Alleen wie alle aanwijzingen vindt, krijgt het geheime einde. Zo zit de motivatie in het lezen zelf (feedback van Zwijsen): het verhaal wordt beter doordat je beter leest.

Aan het einde ziet de leerling een terugblik: welke keuzes bij de tekst pasten, en bij gemiste keuzes de zin waar de aanwijzing stond. Elke keuze hoort bij een tekststructuur (oorzaak en gevolg, volgorde, vergelijken, probleem en oplossing).

Drie dingen zorgen dat opnieuw lezen ook echt lezen is:
- **Varianten:** elke keuze heeft 2 of 3 versies van de aanwijzing. Bij elke leesbeurt kiest de app per keuze een andere versie dan de vorige keer, dus wie de antwoorden onthoudt, zit er de volgende keer naast.
- **Sporen:** fouten komen later terug in het verhaal (een natte schoen, een gescheurde mouw, een moeie vos) en in het einde.
- **Voortgang:** de homepage toont per verhaal de beste score en of het geheime einde gevonden is. Het einde vergelijkt de score met de vorige keer. Dit wordt alleen in de browser bewaard.

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

- `decision`: tekst met een vraag en keuzes, plus `variants`. Elke variant zegt welke keuze past (`fits`), welke zin de aanwijzing is (`clue`) en welke woorden in de tekst komen (`vars`). Gaat de leerling naar de passende keuze, dan gaat het verhaal naar `onFit`; anders naar de `miss`-passage van die keuze.
- `passage`: tekst met een knop "Lees verder" naar `next`. Met `sets` zet je een vlag, bijvoorbeeld `natteSchoen`.
- `finale`: het laatste stuk tekst. Daarna kiest de app een einde uit `endings` op basis van hoeveel keuzes bij de tekst pasten (`minScore`).

In alle teksten kun je twee soorten markeringen gebruiken:
- `{plek}`: wordt vervangen door de waarde uit de gekozen variant.
- `[[natteSchoen: Haar schoen soppt.]]`: wordt alleen getoond als die vlag eerder is gezet. Met `[[!natteSchoen: ...]]` juist alleen als hij níet is gezet.

Let op: zet het antwoord nooit in de tekst van een keuze. "De stenen brug" is goed, "De stenen brug, die is stevig" verklapt het antwoord.

Voeg het verhaal toe aan `src/prototype-data/stories.ts`. `npm test` controleert of het verhaal klopt: alle verwijzingen bestaan, elke aanwijzing staat letterlijk in de tekst van zijn variant, varianten gebruiken dezelfde woorden, elke gebruikte vlag en variabele bestaat, elke route eindigt, elke route heeft evenveel keuzes en elk einde is bereikbaar. Ook wordt elke combinatie van varianten gecontroleerd op achtergebleven markeringen.

## Bevindingen
_Nog in te vullen na testen._
