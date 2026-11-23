# TellTale

## Concept
Interactieve verhalen waarin de leerling keuzes maakt. Bij elke keuze staat in de tekst wat slim is om te doen. Wie goed leest, kiest de keuze die past bij de tekst. Wie dat niet doet, krijgt geen "fout!"-scherm: er gaat iets mis in het verhaal, de hoofdpersoon herstelt zich en het verhaal gaat verder.

Hoe meer keuzes bij de tekst passen, hoe mooier het einde. Alleen wie alle aanwijzingen vindt, krijgt het geheime einde. Zo zit de motivatie in het lezen zelf (feedback van Zwijsen): het verhaal wordt beter doordat je beter leest.

Aan het einde ziet de leerling geen cijfer, maar "Jouw tocht": per keuze wat er in het verhaal gebeurde ("Een spoor!", "Krak!"). Bij keuzes die goed gelezen waren staat "Goed gelezen!". Bij de andere keuzes kan de leerling zelf openklikken wat er in de tekst stond. Er staan alleen positieve berichten bij (beter gelezen dan vorige keer, goed gemarkeerd), nooit een score of wat er misging. Het is geen toets: voor het kind moet het einde motiveren. Scores worden wel bewaard, zodat een leerkrachtoverzicht ze later kan tonen. Elke keuze hoort bij een tekststructuur (oorzaak en gevolg, volgorde, vergelijken, probleem en oplossing); die staat in de data, maar wordt niet aan het kind getoond.

Drie dingen zorgen dat opnieuw lezen ook echt lezen is:
- **Varianten:** elke keuze heeft 2 of 3 versies van de aanwijzing. Bij elke leesbeurt kiest de app per keuze een andere versie dan de vorige keer, dus wie de antwoorden onthoudt, zit er de volgende keer naast.
- **Sporen:** fouten komen later terug in het verhaal (een natte schoen, een gescheurde mouw, een moeie vos) en in het einde.
- **Zichtbare sporen:** naast het verhaal staat een kaartje "Onderweg" met wat de leerling meedraagt: een natte schoen, een scheur in de mouw, of juist de vos als nieuwe vriend. De lucht achter het verhaal gaat van ochtend naar avond. Elke keuze kost wat tijd, en een keuze die niet bij de tekst past kost extra. Wie goed leest, is 's middags klaar; wie veel mist, komt in het donker thuis, net als in het einde.
- **Eerst lezen, dan de vraag:** bij een keuze ziet de leerling eerst alleen de tekst. Pas na "Klaar met lezen" verschijnt de vraag, en dan is de tekst weg. Zo weet de leerling niet waar hij naar moet zoeken en moet hij de hele tekst lezen; vooruit scrollen naar de vraag en dan terugzoeken kan niet. Alleen de zinnen die de leerling zelf heeft gemarkeerd blijven zichtbaar in het speurdersboekje.
- **Markeerstift en speurdersboekje:** de leerling kan tijdens het lezen op een zin tikken om hem te markeren, net als de markeerstift in Estafette. De markeerstift heeft 2 strepen per bladzijde (`INK_PER_PAGE`), dus alles markeren kan niet: de leerling moet kiezen wat het belangrijkst is. Een streep weghalen geeft de inkt terug. Gemarkeerde zinnen staan bij elke keuze in het speurdersboekje. Het einde prijst de leerling als de gemarkeerde zinnen echte aanwijzingen waren. "Je had de aanwijzing wel gemarkeerd!" helpt de leerling (en de leerkracht) te zien of het misging bij het vinden of bij het begrijpen van de aanwijzing.
- **Scanbestendige aanwijzingen:** de tekst noemt altijd álle keuzes, niet alleen de goede. Mama zegt bijvoorbeeld dat Pluis niet van water houdt, muizen met rust laat en het liefst in de zon ligt; het bordje zegt welke plek bij welk ding hoort. Wie alleen zoekt naar een woord dat op een knop staat, vindt dus alle drie. Pas wie de zinnen begrijpt en combineert, weet het antwoord. Woorden als "niet", "maar" en "als laatste" doen ertoe.
- **Woordhulp:** moeilijke woorden (varens, mos, leuning) hebben een stippellijn. Tikt de leerling erop, dan verschijnt een korte uitleg onder de alinea. Zo mist een leerling een aanwijzing niet door één onbekend woord. De uitleg verklapt nooit het antwoord.
- **Puzzels:** twee keer in het verhaal is er een kleine puzzel over een tekststructuur. Bij "Mila speurt" koppelt de leerling wat Mila ziet aan wat het betekent (oorzaak en gevolg). Bij "Mila vertelt" zet de leerling de gebeurtenissen in de goede volgorde (tijdvolgorde). Een puzzel telt niet mee voor het einde: de leerling probeert tot het klopt. Wat goed is wordt groen en blijft staan, de rest gaat terug met een hint.
- **Voortgang:** de homepage toont per verhaal hoe vaak het gelezen is en of het geheime einde gevonden is. Het einde zegt het als de leerling beter las dan vorige keer. Scores worden alleen in de browser bewaard.

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
Verhalen staan in `src/prototype-data/`. Een verhaal bestaat uit delen (`nodes`) van vier soorten:

- `decision`: tekst met een vraag en keuzes, plus `variants`. Elke variant zegt welke keuze past (`fits`), welke zin de aanwijzing is (`clue`) en welke woorden in de tekst komen (`vars`). Gaat de leerling naar de passende keuze, dan gaat het verhaal naar `onFit`; anders naar de `miss`-passage van die keuze.
- `passage`: tekst met een knop "Lees verder" naar `next`. Met `sets` zet je een vlag, bijvoorbeeld `natteSchoen`.
- `puzzle`: tekst met een puzzel, daarna naar `next`. `type: 'order'` met `items` in de goede volgorde (tijdvolgorde), of `type: 'match'` met `pairs` van `left` (wat je ziet) en `right` (wat het betekent). De app husselt ze zelf.
- `finale`: het laatste stuk tekst. Daarna kiest de app een einde uit `endings` op basis van hoeveel keuzes bij de tekst pasten (`minScore`).

In alle teksten kun je twee soorten markeringen gebruiken:
- `{plek}`: wordt vervangen door de waarde uit de gekozen variant.
- `[[natteSchoen: Haar schoen soppt.]]`: wordt alleen getoond als die vlag eerder is gezet. Met `[[!natteSchoen: ...]]` juist alleen als hij níet is gezet.

Elke vlag heeft een spoor nodig in `traces`, met een korte tekst, een plaatje en `tone: 'bad'` of `'good'`. Zo verschijnt hij op het kaartje "Onderweg". Zet `dusk: true` als tijd belangrijk is in het verhaal; dan wordt de lucht steeds donkerder.

Elke keuze heeft een `keyword`: het woord waarmee de tekst die keuze noemt (`'molen'`, `'links'`). De test eist dat elke variant álle keywords noemt, zodat scannen naar een knopwoord niet werkt. Schrijf de aanwijzing dus zo dat de leerling moet begrijpen en combineren: noem de foute keuzes met "niet", laat de leerling twee zinnen koppelen, of laat de volgorde de doorslag geven.

Moeilijke woorden zet je in `words`, met alle vormen die in de tekst staan (`['rot', 'rotte']`) en een korte uitleg. De uitleg mag het woord uitleggen, maar nooit zeggen welke keuze past.

Let op: zet het antwoord nooit in de tekst van een keuze. "De stenen brug" is goed, "De stenen brug, die is stevig" verklapt het antwoord.

Voeg het verhaal toe aan `src/prototype-data/stories.ts`. `npm test` controleert of het verhaal klopt: alle verwijzingen bestaan, elke aanwijzing staat letterlijk in de tekst van zijn variant, varianten gebruiken dezelfde woorden, elke gebruikte vlag en variabele bestaat, elke vlag heeft een spoor, elke variant noemt alle keuzes, elk moeilijk woord staat in het verhaal, puzzels hebben genoeg verschillende onderdelen, elke route eindigt, elke route heeft evenveel keuzes en elk einde is bereikbaar. Ook wordt elke combinatie van varianten gecontroleerd op achtergebleven markeringen.

## Bevindingen
_Nog in te vullen na testen._
