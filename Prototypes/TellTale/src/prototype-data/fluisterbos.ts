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
      text: `Op een zonnige ochtend loopt Mila het Fluisterbos in. Haar witte kat Pluis is sinds gisteravond verdwenen. "Help jij me zoeken, {naam}?" vraagt ze aan jou.

Mama zei vanochtend nog: "{moeder}"

Bij de ingang van het bos staat een oud bordje met drie pijlen. Eén pijl wijst naar de beek, waar kleine visjes zwemmen. Eén pijl wijst naar de oude molen, vol zakken meel en muizen. En één pijl wijst naar de bloemenheuvel, waar geen bomen staan en de zon de hele dag schijnt.`,
      question: 'Welke kant gaat Mila op?',
      // Scan-proof: mama names all three things and says "niet" to two of them. Only by combining
      // what mama says with what the bordje says does the child know where Pluis is.
      choices: [
        { text: 'Naar de oude molen', keyword: 'molen', miss: 'molenMis' },
        { text: 'Naar de beek', keyword: 'beek', miss: 'beekMis' },
        { text: 'Naar de bloemenheuvel', keyword: 'bloemenheuvel', miss: 'heuvelMis' },
      ],
      variants: [
        {
          fits: 1,
          clue: 'Maar vis, daar is hij dol op.',
          vars: {
            moeder: 'Pluis jaagt nooit op muizen en hij houdt niet van de hete zon. Maar vis, daar is hij dol op.',
            plek: 'de beek',
            reden: 'Pluis is dol op vis',
          },
        },
        {
          fits: 0,
          clue: 'Maar muizen vangen, dat vindt hij het allerleukst.',
          vars: {
            moeder: 'Pluis houdt niet van water en hij ligt liever in de schaduw dan in de zon. Maar muizen vangen, dat vindt hij het allerleukst.',
            plek: 'de oude molen',
            reden: 'Pluis vangt het liefst muizen',
          },
        },
        {
          fits: 2,
          clue: 'Hij ligt het allerliefst ergens lekker in de zon.',
          vars: {
            moeder: 'Pluis houdt niet van water en muizen laat hij altijd met rust. Hij ligt het allerliefst ergens lekker in de zon.',
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

Het gras is op één plek helemaal platgedrukt. Ernaast staat een bakje water van een boer, maar het is leeg. En naast het plukje haar lopen kleine pootafdrukken het bos in.`,
      next: 'speuren',
    },

    // Puzzel: oorzaak en gevolg. Wat betekent wat Mila ziet?
    speuren: {
      kind: 'puzzle',
      chapter: 'Hoofdstuk 1',
      title: 'Mila speurt',
      illustration: 'tracks',
      text: `Mila gaat op haar hurken zitten en kijkt goed. Een echte speurder vraagt zich bij alles af: waardoor komt dat?`,
      puzzle: {
        type: 'match',
        prompt: 'Wat betekent wat Mila ziet? Kies bij elk spoor wat erbij past.',
        pairs: [
          { left: 'Een plukje wit kattenhaar', right: 'Pluis is hier geweest.' },
          { left: 'Platgedrukt gras', right: 'Pluis heeft hier liggen slapen.' },
          { left: 'Een leeg bakje water', right: 'Pluis had dorst en heeft gedronken.' },
          { left: 'Pootafdrukken het bos in', right: 'Pluis is verder het bos in gelopen.' },
        ],
      },
      next: 'uil',
    },

    // Hoofdstuk 2: tijdvolgorde
    uil: {
      kind: 'decision',
      chapter: 'Hoofdstuk 2',
      title: 'De wijze uil',
      illustration: 'owl',
      text: `De pootafdrukken houden op bij een omgevallen boom. Op de stam zit een uil. "Zoek je een witte kat?" vraagt hij. "Ik zag hem vannacht. Luister goed, dan vertel ik je de weg. Jij ook, {naam}."

"{route}"

Mila bedankt de uil en loopt het pad af. Bij de grote steen en bij het beekje doet ze precies wat de uil zei. Dan staat ze voor een grote boom met een gat in de stam. De holle boom! Hier kan ze naar links, naar rechts of rechtdoor.`,
      question: 'Welke kant gaat Mila op?',
      // Scan-proof: the uil names all three directions, one per place on the route. Only by keeping
      // the order straight does the child know which direction belongs to the holle boom.
      choices: [
        { text: 'Linksaf', keyword: 'links', miss: 'linksMis' },
        { text: 'Rechtsaf', keyword: 'rechts', miss: 'rechtsMis' },
        { text: 'Rechtdoor', keyword: 'rechtdoor', miss: 'rechtdoorMis' },
      ],
      variants: [
        {
          fits: 0,
          clue: 'Als laatste kom je bij een boom met een groot gat in de stam. Daar ga je linksaf, langs de varens.',
          vars: {
            route:
              'Eerst ga je bij de grote steen rechtsaf. Daarna loop je bij het beekje gewoon rechtdoor. Als laatste kom je bij een boom met een groot gat in de stam. Daar ga je linksaf, langs de varens.',
            richting: 'linksaf',
          },
        },
        {
          fits: 1,
          clue: 'Als laatste kom je bij een boom met een groot gat in de stam. Daar ga je rechtsaf, het smalle pad op.',
          vars: {
            route:
              'Eerst ga je bij de grote steen linksaf. Daarna loop je bij het beekje gewoon rechtdoor. Als laatste kom je bij een boom met een groot gat in de stam. Daar ga je rechtsaf, het smalle pad op.',
            richting: 'rechtsaf',
          },
        },
        {
          fits: 2,
          clue: 'Als laatste kom je bij een boom met een groot gat in de stam. Daar loop je rechtdoor, over de stapstenen.',
          vars: {
            route:
              'Eerst ga je bij de grote steen linksaf. Daarna ga je bij het beekje rechtsaf. Als laatste kom je bij een boom met een groot gat in de stam. Daar loop je rechtdoor, over de stapstenen.',
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

Dit is het moeras! Wat had de uil gezegd? Bij de holle boom moest ze {richting}. Met een soppende schoen loopt ze terug.`,
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
        { text: 'De houten brug', keyword: 'houten', miss: 'houtenMis' },
        { text: 'De stenen brug', keyword: 'stenen', miss: 'stenenMis' },
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
        { text: 'Ze geeft de vos haar appel', keyword: 'appel', miss: 'appelMis' },
        { text: 'Ze pakt de tuinhandschoen', keyword: 'handschoen', miss: 'handschoenMis' },
        { text: 'Ze pakt het touw', keyword: 'touw', miss: 'touwMis' },
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
      next: 'vertellen',
      sets: ['vos'],
    },

    handschoenMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een handschoen helpt niet',
      illustration: 'glove',
      text: `Mila trekt de dikke tuinhandschoen aan. Maar wat moet ze er nu mee? "Daar heb ik niets aan," zegt de vos zachtjes.

Mila denkt nog eens na over wat de vos zei. Dan weet ze het: ze gaat {oplossing}. Het lukt, al duurt het even. De vos is nu wel heel moe.`,
      next: 'vertellen',
      sets: ['vos'],
    },

    touwMis: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een touw helpt niet',
      illustration: 'rope',
      text: `Mila pakt het touw en houdt het omhoog. "Wat moet ik met een touw?" vraagt de vos verbaasd.

Mila denkt nog eens na over wat de vos zei. Dan weet ze het: ze gaat {oplossing}. Het lukt, al duurt het even. De vos is nu wel heel moe.`,
      next: 'vertellen',
      sets: ['vos'],
    },

    vosVrij: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een nieuwe vriend',
      illustration: 'fox',
      text: `Het lukt! De vos springt overeind en zwaait met zijn staart. "Dank jullie wel, Mila en {naam}!" roept hij blij. "Kom, ik weet waar je kat is."`,
      next: 'vertellen',
      sets: ['vriend'],
    },

    // Puzzel: tijdvolgorde. Mila vertelt de vos wat er tot nu toe gebeurde.
    vertellen: {
      kind: 'puzzle',
      chapter: 'Hoofdstuk 4',
      title: 'Mila vertelt',
      illustration: 'fox',
      text: `Onderweg vraagt de vos: "Hoe ben je eigenlijk helemaal hier gekomen?"

Mila denkt even na. Ze wil het verhaal goed vertellen, van het begin tot nu.`,
      puzzle: {
        type: 'order',
        prompt: 'Help Mila vertellen. Tik de gebeurtenissen aan in de volgorde waarin ze gebeurden.',
        items: [
          'Mila vindt een plukje kattenhaar bij {plek}.',
          'De uil vertelt Mila de weg.',
          'Mila staat bij de holle boom.',
          'Mila gaat over de rivier.',
          'Mila helpt de vos.',
        ],
      },
      next: 'eik',
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
        { text: 'Ze roept hard naar hem', keyword: 'roep', miss: 'roepen' },
        { text: 'Ze schudt aan de boom', keyword: 'schud', miss: 'schudden' },
        { text: 'Ze gaat zachtjes zitten en praat rustig', keyword: 'rustig', miss: 'zachtjesMis' },
        { text: 'Ze zet een lange tak tegen de stam', keyword: 'tak', miss: 'takMis' },
      ],
      variants: [
        {
          fits: 2,
          clue: 'Sinds het onweer is hij bang voor harde geluiden.',
          vars: {
            angst: `"Hij schrok vannacht van het onweer," zegt de vos. "Door de harde donder rende hij in paniek de boom in. Er zitten genoeg takken om langs naar beneden te klimmen, maar hij durft niet. Sinds het onweer is hij bang voor harde geluiden. Roepen of aan de boom schudden maakt het alleen maar erger. Hij moet eerst weer rustig worden."`,
            oplossingPluis: 'zachtjes zitten en rustig tegen hem praten',
          },
        },
        {
          fits: 3,
          clue: 'Hij heeft iets nodig waarlangs hij naar beneden kan lopen.',
          vars: {
            angst: `"Hij is niet bang," zegt de vos. "Roepen, aan de boom schudden of rustig tegen hem praten helpt dus niets: hij wíl wel naar beneden. Maar de onderste takken zijn afgebroken, dus hij kan niet meer springen. Hij heeft iets nodig waarlangs hij naar beneden kan lopen."`,
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

Mila knuffelt hem stevig. "Ik heb je gevonden," fluistert ze. Dan kijkt ze naar jou. "Dank je wel, {naam}. Zonder jou was het nooit gelukt."`,
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

  // Moeilijke woorden. De uitleg helpt het woord te begrijpen, maar verklapt nooit welke keuze past.
  words: [
    { forms: ['meel'], meaning: 'Fijn gemalen graan. Van meel bak je brood.' },
    { forms: ['varens'], meaning: 'Groene planten met lange bladeren die op veren lijken. Ze groeien vaak in het bos.' },
    { forms: ['stapstenen'], meaning: 'Grote platte stenen in het water. Je stapt van de ene naar de andere.' },
    { forms: ['moeras'], meaning: 'Natte, zachte grond waar je in weg kunt zakken.' },
    { forms: ['rot', 'rotte'], meaning: 'Oud en zacht geworden, zodat het makkelijk kapot gaat.' },
    { forms: ['leuning'], meaning: 'Een stang langs een brug of trap waar je je aan vasthoudt.' },
    { forms: ['mos'], meaning: 'Een zacht, groen plantje dat op stenen en bomen groeit. Nat mos is glad.' },
    { forms: ['braamstruik'], meaning: 'Een struik met bramen en scherpe stekels.' },
    { forms: ['doornen'], meaning: 'Scherpe punten aan een plant, waar je je aan kunt prikken.' },
    { forms: ['onweer'], meaning: 'Slecht weer met bliksem en harde donder.' },
  ],
}
