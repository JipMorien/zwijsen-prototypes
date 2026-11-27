# Smart Agent

## Concept
Een slim leesmaatje (AI-agent) dat met de leerling meeleest en de leerervaring personaliseert. Na elk stukje tekst stelt de agent een paar begrijpend-lezenvragen, geeft hints in plaats van alleen goed/fout, en past de moeilijkheid aan op hoe de leerling het doet.

## Kernfunctionaliteiten
- Begripsvragen na elk tekstgedeelte (hoofdgedachte, verbanden, woordbetekenis)
- Hints en uitleg bij een fout antwoord, met verwijzing naar de plek in de tekst
- Adaptieve moeilijkheid: makkelijker na fouten, uitdagender bij succes
- Uitleg van moeilijke woorden op kindniveau

## Onderzoeksvraag
Verbetert een gepersonaliseerd AI-leesmaatje het tekstbegrip van leerlingen ten opzichte van de huidige oefeningen?

## Aandachtspunten
- Privacy (AVG): leerlinggegevens van minderjarigen. In het prototype werken we met nepdata.
- De agent mag alleen antwoorden op basis van de tekst, niet zelf dingen verzinnen.

## Starten
Getest met Node 24. Voer dit uit in deze map:

```bash
npm install
npm run dev
```

| Commando | Wat het doet |
|---|---|
| `npm run dev` | Start het leesscherm met debugpaneel |
| `npm test` | Draait de tests |
| `npm run simulate` | Laat een nep-leerling 20 sessies doen en toont of het systeem zijn niveau vindt |

Zonder extra instellingen komen hints uit de `mock`-modus: de agent wijst dan de zin aan waar het antwoord staat. Voor een echt taalmodel kopieer je `.env.example` naar `.env` en zet je `LLM_PROVIDER=openai`. Dat werkt met elk OpenAI-compatibel endpoint, zoals Ollama lokaal.

## Stand van zaken (sprint 1)
- Gebouwd: leesscherm met vragen, Elo-rating per vaardigheid, keuze van tekst en vraag rond 70-75% kans op goed, hints met zinscontrole, debugpaneel, gesimuleerde leerling.
- Tijdelijk: de zes teksten in `src/content/texts.json` en hun moeilijkheid zijn door ons zelf bedacht. Het niveau is aangenomen op groep 5-6.
- Nog niet: kalibratiefase, bandit, koppeling met de andere prototypes, vergelijking gehost/lokaal model, leestijd en herlezen meten.

## Bevindingen
_Nog in te vullen na testen._
