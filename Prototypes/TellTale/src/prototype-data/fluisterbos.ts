import type { Story } from '../types/story'

/**
 * Every decision has 2-3 variants. Each playthrough picks one per decision, so the clue and the
 * choice that fits change when the story is read again.
 *
 * A choice that does not fit leads to a "miss" passage: something goes wrong, Mila recovers, and
 * the story goes on. Miss passages set flags, and later texts mention those traces with [[flag: ...]].
 * How many choices fit the text decides the ending.
 */
export const fluisterbos: Story = {
  id: 'fluisterbos',
  title: 'Het geheim van het Fluisterbos',
  description: 'Help Mila haar kat terug te vinden. Lees goed: hoe beter je leest, hoe mooier het einde.',
  cover: 'forest',
  color: 'green',
  level: 'M5',
  category: 'Avontuur',
  time: '10 minuten',
  available: true,
  startNode: 'start',
  dusk: true,

  nodes: {
    // Hoofdstuk 1: oorzaak en gevolg
    start: {
      kind: 'decision',
      chapter: 'Hoofdstuk 1',
      title: 'Waar is Pluis?',
      illustration: 'forest',
      text: `Op een zonnige ochtend loopt Mila het Fluisterbos in. Haar witte kat Pluis is sinds gisteravond verdwenen.

Mama zei vanochtend nog: "{moeder}"

Bij de ingang van het bos staat een oud bordje met drie pijlen. Eén pijl wijst naar de beek, één naar de oude molen en één naar de heuvel met bloemen.`,
      question: 'Welke kant gaat Mila op?',
      choices: [
        { text: 'Naar de oude molen', miss: 'molenMis' },
        { text: 'Naar de beek', miss: 'beekMis' },
        { text: 'Naar de bloemenheuvel', miss: 'heuvelMis' },
      ],
      variants: [
        {
          fits: 1,
          clue: 'Pluis is dol op vis. Misschien is hij naar de beek gelopen, want daar zwemmen kleine visjes.',
          vars: {
            moeder: 'Pluis is dol op vis. Misschien is hij naar de beek gelopen, want daar zwemmen kleine visjes.',
            plek: 'de beek',
            reden: 'Pluis is dol op vis',
          },
        },
        {
          fits: 0,
          clue: 'Pluis jaagt graag op muizen. In de oude molen wonen heel veel muizen, dus misschien is hij daarheen gegaan.',
          vars: {
            moeder: 'Pluis jaagt graag op muizen. In de oude molen wonen heel veel muizen, dus misschien is hij daarheen gegaan.',
            plek: 'de oude molen',
            reden: 'Pluis jaagt graag op muizen',
          },
        },
        {
          fits: 2,
          clue: 'Pluis ligt het liefst in de zon. Op de bloemenheuvel staan geen bomen, dus daar schijnt de zon de hele dag.',
          vars: {
            moeder: 'Pluis ligt het liefst in de zon. Op de bloemenheuvel staan geen bomen, dus daar schijnt de zon de hele dag.',
            plek: 'de bloemenheuvel',
            reden: 'Pluis ligt het liefst in de zon',
          },
        },
      ],
      onFit: 'spoor',
      structure: 'oorzaak-gevolg',
    },

    molenMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Een stoffige molen',
      illustration: 'mill',
      text: `Mila loopt helemaal naar de oude molen. Het is een lange wandeling en het pad zit vol kuilen.

In de molen is het donker en stoffig. Mila niest drie keer. Een paar muizen rennen weg, maar van Pluis is geen spoor.

Wat zei mama ook alweer? {reden}! Mila draait zich om en loopt naar {plek}.`,
      next: 'spoor',
      sets: ['omweg'],
    },

    beekMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Alleen maar water',
      illustration: 'stream',
      text: `Mila loopt naar de beek. Het water klatert en er zwemmen kleine visjes. Maar Pluis is nergens te zien.

Op een natte steen glijdt Mila bijna uit. Dat scheelde niet veel!

Wat zei mama ook alweer? {reden}! Mila loopt snel verder naar {plek}.`,
      next: 'spoor',
      sets: ['omweg'],
    },

    heuvelMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Alleen maar bloemen',
      illustration: 'flowers',
      text: `Mila klimt de bloemenheuvel op. Het ruikt er heerlijk, maar er zoemen ook heel veel bijen.

Eén bij landt op haar neus. Mila blijft stokstijf staan tot hij weer wegvliegt. Pfoe! Van Pluis is geen spoor.

Wat zei mama ook alweer? {reden}! Mila loopt de heuvel af, op weg naar {plek}.`,
      next: 'spoor',
      sets: ['omweg'],
    },

    spoor: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Een spoor!',
      illustration: 'tracks',
      text: `Bij {plek} ziet Mila iets wits liggen. Een plukje kattenhaar! Pluis is hier echt geweest.

[[omweg: Mila is wel al een beetje moe van de omweg die ze heeft gemaakt.]]

Naast het plukje haar lopen kleine pootafdrukken het bos in. Mila volgt ze, dieper en dieper het Fluisterbos in.`,
      next: 'uil',
    },

    // Hoofdstuk 2: tijdvolgorde
    uil: {
      kind: 'decision',
      chapter: 'Hoofdstuk 2',
      title: 'De wijze uil',
      illustration: 'owl',
      text: `De pootafdrukken houden op bij een omgevallen boom. Op de stam zit een uil. "Zoek je een witte kat?" vraagt hij. "Ik zag hem vannacht. Luister goed, dan vertel ik je de weg."

"{route}"

Mila bedankt de uil en loopt het pad af. Na een tijdje ziet ze een grote boom met een gat in de stam. De holle boom! Hier splitst het pad zich in drieën.`,
      question: 'Welke kant gaat Mila op?',
      choices: [
        { text: 'Linksaf', miss: 'linksMis' },
        { text: 'Rechtsaf', miss: 'rechtsMis' },
        { text: 'Rechtdoor', miss: 'rechtdoorMis' },
      ],
      variants: [
        {
          fits: 0,
          clue: 'Sla bij de holle boom linksaf, langs de varens.',
          vars: {
            route:
              'Loop eerst over het pad tot aan de grote holle boom. Ga daar niet rechtdoor, want daar begint het moeras. Sla bij de holle boom linksaf, langs de varens.',
            richting: 'linksaf',
          },
        },
        {
          fits: 1,
          clue: 'Sla bij de holle boom rechtsaf, het smalle pad op.',
          vars: {
            route:
              'Loop eerst over het pad tot aan de grote holle boom. Ga daar niet rechtdoor, want daar begint het moeras. Sla bij de holle boom rechtsaf, het smalle pad op.',
            richting: 'rechtsaf',
          },
        },
        {
          fits: 2,
          clue: 'Ga bij de holle boom gewoon rechtdoor, over de stapstenen.',
          vars: {
            route:
              'Loop eerst over het pad tot aan de grote holle boom. De paden naar links en naar rechts lopen allebei dood. Ga bij de holle boom gewoon rechtdoor, over de stapstenen.',
            richting: 'rechtdoor',
          },
        },
      ],
      onFit: 'bruggen',
      structure: 'tijdvolgorde',
    },

    linksMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 2',
      title: 'Doornen!',
      illustration: 'thorns',
      text: `Mila slaat linksaf. Het pad wordt steeds smaller, tot ze voor een muur van doornstruiken staat. Haar mouw blijft haken en scheurt een stukje open.

Wat had de uil gezegd? Bij de holle boom moest ze {richting}! Mila loopt terug en probeert het opnieuw.`,
      next: 'bruggen',
      sets: ['scheur'],
    },

    rechtsMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 2',
      title: 'Een steile helling',
      illustration: 'slope',
      text: `Mila slaat rechtsaf. Het pad loopt dood bij een steile helling vol losse stenen. Mila glijdt een stukje naar beneden en haalt haar mouw open aan een tak.

Wat had de uil gezegd? Bij de holle boom moest ze {richting}! Mila klimt terug en probeert het opnieuw.`,
      next: 'bruggen',
      sets: ['scheur'],
    },

    rechtdoorMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 2',
      title: 'Natte voeten',
      illustration: 'swamp',
      text: `Mila loopt rechtdoor. De grond wordt steeds zachter. Plotseling zakt haar voet weg in de modder. Bah! Haar schoen is helemaal nat en vies. Een kikker kijkt haar verbaasd aan.

Nu weet Mila het weer: hier begint het moeras. Bij de holle boom moest ze {richting}! Met een soppende schoen loopt ze terug.`,
      next: 'bruggen',
      sets: ['natteSchoen'],
    },

    // Hoofdstuk 3: vergelijken
    bruggen: {
      kind: 'decision',
      chapter: 'Hoofdstuk 3',
      title: 'Twee bruggen',
      illustration: 'bridge',
      text: `Het pad eindigt bij een brede rivier. Aan de overkant hoort Mila een zacht gemiauw. Pluis!

[[natteSchoen: Haar natte schoen soppt bij elke stap.]]

Er zijn twee bruggen. {bruggen}

Mila wil zo snel mogelijk naar Pluis. Maar ze wil ook veilig aan de overkant komen.`,
      question: 'Over welke brug gaat Mila?',
      choices: [
        { text: 'De houten brug', miss: 'houtenMis' },
        { text: 'De stenen brug', miss: 'stenenMis' },
      ],
      variants: [
        {
          fits: 1,
          clue: 'De houten brug is dichtbij, maar de planken zijn rot en er ontbreken er een paar.',
          vars: {
            bruggen:
              'De houten brug is dichtbij, maar de planken zijn rot en er ontbreken er een paar. De stenen brug ligt een stukje verderop, maar hij is stevig en heeft een leuning.',
            veilig: 'de stenen brug',
          },
        },
        {
          fits: 0,
          clue: 'De stenen brug is dichtbij, maar de stenen zijn glad van het mos en het water stroomt eroverheen.',
          vars: {
            bruggen:
              'De stenen brug is dichtbij, maar de stenen zijn glad van het mos en het water stroomt eroverheen. De houten brug ligt een stukje verderop, maar hij is net nieuw gemaakt en heeft een stevige leuning.',
            veilig: 'de houten brug',
          },
        },
      ],
      onFit: 'vos',
      structure: 'vergelijken',
    },

    houtenMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 3',
      title: 'Krak!',
      illustration: 'bridge',
      text: `Mila stapt op de houten brug. De rotte planken kraken onder haar voeten.

Halverwege hoort ze een harde KRAK. Een plank breekt en valt in de rivier! Mila springt net op tijd naar de volgende plank.

Met trillende benen komt ze aan de overkant. Dat was gevaarlijk. Ze had beter {veilig} kunnen nemen.`,
      next: 'vos',
      sets: ['brug'],
    },

    stenenMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 3',
      title: 'Spekglad!',
      illustration: 'stones',
      text: `Mila stapt op de stenen brug. Het water stroomt over haar schoenen en de stenen zijn spekglad van het mos.

Halverwege glijdt ze uit! Ze valt op haar knie en kan zich nog net vasthouden aan een steen.

Met een pijnlijke knie komt ze aan de overkant. Dat was gevaarlijk. Ze had beter {veilig} kunnen nemen.`,
      next: 'vos',
      sets: ['brug'],
    },

    // Hoofdstuk 4: probleem en oplossing
    vos: {
      kind: 'decision',
      chapter: 'Hoofdstuk 4',
      title: 'De vos onder de struik',
      illustration: 'fox',
      text: `Aan de overkant hoort Mila gejammer. Onder een struik ligt een kleine vos.

[[brug: Mila's benen trillen nog een beetje van de brug.]]

{probleem}

Mila kijkt in haar rugzak. Ze heeft een appel, een dikke tuinhandschoen en een stuk touw.`,
      question: 'Hoe helpt Mila de vos?',
      choices: [
        { text: 'Ze geeft de vos haar appel', miss: 'appelMis' },
        { text: 'Ze pakt de tuinhandschoen', miss: 'handschoenMis' },
        { text: 'Ze pakt het touw', miss: 'touwMis' },
      ],
      variants: [
        {
          fits: 1,
          clue: 'De takken moeten opzij geduwd worden, met iets waar de doornen niet doorheen prikken.',
          vars: {
            probleem: `Zijn staart zit klem in een braamstruik vol doornen. "Als ik trek, prikken de doornen alleen maar dieper," zegt de vos verdrietig. "De takken moeten opzij geduwd worden, met iets waar de doornen niet doorheen prikken."`,
            oplossing: 'de takken opzij duwen met haar tuinhandschoen',
          },
        },
        {
          fits: 2,
          clue: 'Als je iets om de tak bindt, kunnen we er samen aan trekken.',
          vars: {
            probleem: `Zijn poot zit klem onder een zware tak. "Ik krijg hem niet omhoog," zegt de vos verdrietig. "Als je iets om de tak bindt, kunnen we er samen aan trekken."`,
            oplossing: 'het touw om de tak binden en er samen aan trekken',
          },
        },
        {
          fits: 0,
          clue: 'Als ik iets te eten had, kreeg ik weer kracht om te lopen.',
          vars: {
            probleem: `Hij zit niet vast, maar hij is heel slap. "Ik heb al twee dagen niets gegeten," zegt de vos zachtjes. "Als ik iets te eten had, kreeg ik weer kracht om te lopen."`,
            oplossing: 'de vos haar appel geven',
          },
        },
      ],
      onFit: 'vosVrij',
      structure: 'probleem-oplossing',
    },

    appelMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een appel helpt niet',
      illustration: 'apple',
      text: `De vos eet de appel op. "Lekker," zegt hij, "maar daar heb ik nu niet zoveel aan."

Mila denkt nog eens na over wat de vos zei. Dan weet ze het: ze gaat {oplossing}. Het lukt, al duurt het even. De vos is nu wel heel moe.`,
      next: 'eik',
      sets: ['vos'],
    },

    handschoenMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een handschoen helpt niet',
      illustration: 'glove',
      text: `Mila trekt de dikke tuinhandschoen aan. Maar wat moet ze er nu mee? "Daar heb ik niets aan," zegt de vos zachtjes.

Mila denkt nog eens na over wat de vos zei. Dan weet ze het: ze gaat {oplossing}. Het lukt, al duurt het even. De vos is nu wel heel moe.`,
      next: 'eik',
      sets: ['vos'],
    },

    touwMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een touw helpt niet',
      illustration: 'rope',
      text: `Mila pakt het touw en houdt het omhoog. "Wat moet ik met een touw?" vraagt de vos verbaasd.

Mila denkt nog eens na over wat de vos zei. Dan weet ze het: ze gaat {oplossing}. Het lukt, al duurt het even. De vos is nu wel heel moe.`,
      next: 'eik',
      sets: ['vos'],
    },

    vosVrij: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een nieuwe vriend',
      illustration: 'fox',
      text: `Het lukt! De vos springt overeind en zwaait met zijn staart. "Dank je wel!" roept hij blij. "Kom, ik weet waar je kat is."`,
      next: 'eik',
      sets: ['vriend'],
    },

    // Hoofdstuk 5: oorzaak en gevolg
    eik: {
      kind: 'decision',
      chapter: 'Hoofdstuk 5',
      title: 'Hoog in de eik',
      illustration: 'tree',
      text: `De vos brengt Mila naar een open plek met een enorme eik. [[vos: Hij loopt langzaam, want hij is nog moe.]] Helemaal bovenin ziet Mila iets wits. Het is Pluis!

{angst}

Mila wil hem zo graag naar beneden halen.`,
      question: 'Hoe krijgt Mila Pluis naar beneden?',
      choices: [
        { text: 'Ze roept hard naar hem', miss: 'roepen' },
        { text: 'Ze schudt aan de boom', miss: 'schudden' },
        { text: 'Ze gaat zachtjes zitten en praat rustig', miss: 'zachtjesMis' },
        { text: 'Ze zet een lange tak tegen de stam', miss: 'takMis' },
      ],
      variants: [
        {
          fits: 2,
          clue: 'Sindsdien is hij bang voor harde geluiden.',
          vars: {
            angst: `"Hij schrok vannacht van het onweer," zegt de vos. "Door de harde donder rende hij in paniek de boom in. Sindsdien is hij bang voor harde geluiden."`,
            oplossingPluis: 'zachtjes zitten en rustig tegen hem praten',
          },
        },
        {
          fits: 3,
          clue: 'Hij heeft iets nodig waarlangs hij naar beneden kan lopen.',
          vars: {
            angst: `"Hij is niet bang," zegt de vos. "Maar de onderste takken zijn afgebroken, dus hij kan niet meer naar beneden springen. Hij heeft iets nodig waarlangs hij naar beneden kan lopen."`,
            oplossingPluis: 'een lange tak schuin tegen de stam zetten',
          },
        },
      ],
      onFit: 'gevonden',
      structure: 'oorzaak-gevolg',
    },

    roepen: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Te hard!',
      illustration: 'loud',
      text: `"PLUIS, KOM HIER!" roept Mila zo hard als ze kan.

Pluis drukt zich nog dichter tegen de stam. Dat helpt dus niet.

Mila denkt na over wat de vos zei. Ze gaat {oplossingPluis}. Het duurt heel lang, maar als de zon al laag staat, is Pluis eindelijk beneden.`,
    },

    schudden: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Ritselende bladeren',
      illustration: 'shake',
      text: `Mila schudt aan de boom. De bladeren ritselen en de takken kraken. Pluis klampt zich angstig vast aan zijn tak.

Mila stopt meteen. Ze denkt na over wat de vos zei en gaat {oplossingPluis}. Het duurt heel lang, maar uiteindelijk is Pluis beneden.`,
    },

    zachtjesMis: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Hij kan niet naar beneden',
      illustration: 'cat',
      text: `Mila gaat zachtjes onder de boom zitten en praat rustig tegen Pluis. Pluis miauwt terug, maar hij komt niet. Hij kan echt niet naar beneden!

Dan denkt Mila aan wat de vos zei. Ze gaat {oplossingPluis}. Het duurt even, maar dan is Pluis eindelijk beneden.`,
    },

    takMis: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Veel lawaai',
      illustration: 'loud',
      text: `Mila sleept een lange tak naar de eik. Met veel lawaai schuurt de tak langs de stam. Pluis schrikt en klimt nog hoger!

Dan denkt Mila aan wat de vos zei. Ze gaat {oplossingPluis}. Het duurt heel lang, maar uiteindelijk is Pluis beneden.`,
    },

    gevonden: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Gevonden!',
      illustration: 'cat',
      text: `Het werkt! Voorzichtig komt Pluis naar beneden. Dan springt hij zo in Mila's armen.

Mila knuffelt hem stevig. "Ik heb je gevonden," fluistert ze.`,
    },
  },

  endings: [
    {
      minScore: 5,
      title: 'Het geheime einde: de wenssteen',
      illustration: 'wish',
      text: `Als Mila met Pluis naar huis wil lopen, begint er iets te fonkelen tussen de wortels van de eik. Het is een glinsterende steen.

De uil landt naast haar. "Dat is een wenssteen," zegt hij. "Hij verschijnt alleen voor mensen die heel goed luisteren. En jij hebt vandaag naar alles goed geluisterd."

De vos komt er ook bij. Samen lopen ze naar de rand van het bos. Mila is ruim op tijd thuis voor het eten, met Pluis in haar armen en een wenssteen in haar zak.`,
    },
    {
      minScore: 3,
      title: 'Thuis voor het donker',
      illustration: 'home',
      text: `Mila loopt met Pluis in haar armen naar huis. Haar benen zijn moe van de lange tocht.

[[!vos: De vos loopt nog een stukje met haar mee tot aan de rand van het bos.]]
[[natteSchoen: Haar natte schoen laat bij elke stap een modderspoor achter.]]
[[scheur: Door de scheur in haar mouw waait de wind naar binnen.]]

Net voor het donker wordt, ziet ze haar huis. Mama staat in de deuropening en zwaait. "Je hebt hem gevonden!"

Het was een spannende dag. Toch denkt Mila dat het misschien sneller had gekund, als ze overal net iets beter had opgelet.`,
    },
    {
      minScore: 0,
      title: 'Een lange, lange dag',
      illustration: 'night',
      text: `Als Mila eindelijk thuiskomt, is het al donker. Ze is moe en mama was ongerust.

[[natteSchoen: Haar schoen zit nog vol modder uit het moeras.]]
[[scheur: Mama kijkt naar de scheur in haar mouw en zucht.]]
[[brug: Over de brug vertelt Mila maar niet alles, anders schrikt mama nog meer.]]

"Waar bleef je nou?" vraagt mama. Mila vertelt over haar avontuur. Het ging niet overal goed, maar Pluis is weer thuis.

Die avond in bed denkt Mila aan de uil en de vos. Hadden ze haar niet steeds aanwijzingen gegeven? Volgende keer gaat ze beter opletten.`,
    },
  ],

  traces: {
    vriend: { label: 'De vos is je vriend', illustration: 'friend', tone: 'good' },
    omweg: { label: 'Moe van de omweg', illustration: 'detour', tone: 'bad' },
    scheur: { label: 'Scheur in je mouw', illustration: 'torn', tone: 'bad' },
    natteSchoen: { label: 'Natte schoen', illustration: 'wetShoe', tone: 'bad' },
    brug: { label: 'Geschrokken op de brug', illustration: 'shaky', tone: 'bad' },
    vos: { label: 'De vos is moe', illustration: 'tiredFox', tone: 'bad' },
  },
}
