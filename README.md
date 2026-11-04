# zwijsen-prototypes

Dit is de repository waarin de prototypes die wij voor Zwijsen gemaakt hebben in terug te vinden zijn.

## Over het project

Groepsproject (Fontys, semester 4 – Open Learning) waarin we met z'n vieren het leerplatform dat Zwijsen aan scholen levert proberen te moderniseren. In deze repo verzamelen we de prototypes die we daarvoor bouwen.

### Probleemstelling

Nederlandse kinderen lezen steeds slechter en begrijpen steeds minder van wat ze lezen. Zwijsen biedt basisscholen een digitale leeromgeving aan, maar die webapp stamt uit 2012 en heeft sindsdien alleen in 2019 een frontend-update gehad. Onze opdracht is om het platform te moderniseren met nieuwe technieken en functionaliteiten, met de focus op begrijpend lezen.

## Prototypes

| Prototype | Idee in het kort | Onderzoeksvraag |
|---|---|---|
| [Smart Agent](Prototypes/Smart%20Agent/) | AI-leesmaatje dat meeleest, vragen stelt en de moeilijkheid aanpast | Verbetert een gepersonaliseerd AI-leesmaatje het tekstbegrip? |
| [Tamagotchi](Prototypes/Tamagotchi/) | Digitaal huisdier dat groeit wanneer de leerling teksten leest en begrijpt | Lezen leerlingen vaker uit zichzelf met een huisdier dat van lezen afhangt? |
| [TellTale](Prototypes/TellTale/) | Interactieve keuzeverhalen waarin begrip bepaalt hoe het verhaal verdergaat | Geeft een keuzeverhaal beter begrip en meer leesplezier dan losse vragen? |
| [Reward-based system](Prototypes/Rewardbases%20system/) | Punten, badges, streaks en klasdoelen die beloond worden op begrip | Wat doet een beloningssysteem met leesmotivatie én tekstbegrip? |

Uitgangspunt voor alle prototypes: **beloning en voortgang hangen af van aantoonbaar begrip**, niet van tijd of aantal kliks.

## Structuur

```
Prototypes/
  <naam-prototype>/
    README.md   # concept, functionaliteiten, onderzoeksvraag, hoe te starten, bevindingen
    ...
```

## Afspraken

- Werk op een eigen branch (`prototype/<naam>`) en merge via een pull request naar `main`.
- Houd de README van je prototype bij: hoe je het draait en wat de bevindingen zijn.
- Commit geen secrets of `.env`-bestanden; gebruik een `.env.example`.
- Werk met nepdata, geen echte leerlinggegevens (AVG).
