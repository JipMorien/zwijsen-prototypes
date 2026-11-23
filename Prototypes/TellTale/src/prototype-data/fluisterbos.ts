import type { Story } from '../types/story'

/**
 * Every decision has one choice that fits the text. The other choices are not "wrong" screens:
 * something goes wrong in the story, Mila recovers, and the story goes on.
 * How many choices fit the text decides which ending the child gets.
 */
export const fluisterbos: Story = {
  id: 'fluisterbos',
  title: 'Het geheim van het Fluisterbos',
  description: 'Help Mila haar kat terug te vinden. Lees goed: hoe beter je leest, hoe mooier het einde.',
  emoji: '🌳',
  category: 'Avontuur',
  time: '10 minuten',
  available: true,
  startNode: 'start',

  nodes: {
    start: {
      kind: 'decision',
      chapter: 'Hoofdstuk 1',
      title: 'Waar is Pluis?',
      image: '🌳',
      text: `Op een zonnige ochtend loopt Mila het Fluisterbos in. Haar witte kat Pluis is sinds gisteravond verdwenen.

Mama zei vanochtend nog: "Pluis is dol op vis. Misschien is hij naar de beek gelopen, want daar zwemmen kleine visjes."

Bij de ingang van het bos staat een oud bordje met drie pijlen. Eén pijl wijst naar de beek, één naar de oude molen en één naar de heuvel met bloemen.`,
      question: 'Welke kant gaat Mila op?',
      choices: [
        { text: '🌾 Naar de oude molen', next: 'molen', fitsText: false },
        { text: '💧 Naar de beek', next: 'beek', fitsText: true },
        { text: '🌸 Naar de bloemenheuvel', next: 'heuvel', fitsText: false },
      ],
      clue: 'Pluis is dol op vis. Misschien is hij naar de beek gelopen, want daar zwemmen kleine visjes.',
      structure: 'oorzaak-gevolg',
    },

    molen: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Een stoffige molen',
      image: '🌾',
      text: `Mila loopt helemaal naar de oude molen. Het is een lange wandeling en het pad is vol kuilen.

In de molen is het donker en stoffig. Mila niest drie keer. Er is geen kat te zien, alleen een paar muizen die snel wegrennen.

Wat had mama ook alweer gezegd? Iets over vis... Mila draait zich om en loopt terug naar de beek. Ze is al een beetje moe.`,
      next: 'beek',
    },

    heuvel: {
      kind: 'passage',
      chapter: 'Hoofdstuk 1',
      title: 'Alleen maar bloemen',
      image: '🌸',
      text: `Mila klimt de bloemenheuvel op. Het ruikt er heerlijk, maar er zoemen ook heel veel bijen.

Eén bij landt op haar neus. Mila blijft stokstijf staan tot hij weer wegvliegt. Pfoe!

Van Pluis is geen spoor. Mila denkt aan wat mama zei over vis en loopt de heuvel weer af, op weg naar de beek.`,
      next: 'beek',
    },

    beek: {
      kind: 'decision',
      chapter: 'Hoofdstuk 2',
      title: 'De wijze uil',
      image: '🦉',
      text: `Bij de beek ziet Mila kleine pootafdrukken in de modder. Die zijn van Pluis!

Op een tak boven het water zit een uil. "Zoek je een witte kat?" vraagt hij. "Ik zag hem vannacht. Luister goed, dan vertel ik je de weg."

"Loop eerst langs de beek tot aan de grote holle boom. Ga daar niet verder langs het water, want daar begint het moeras. Sla bij de holle boom rechtsaf, het smalle pad op."

Mila bedankt de uil en loopt langs de beek. Na een tijdje ziet ze een grote boom met een gat in de stam. De holle boom!`,
      question: 'Welke kant gaat Mila nu op?',
      choices: [
        { text: '🌿 Rechtsaf, het smalle pad op', next: 'bruggen', fitsText: true },
        { text: '💧 Verder langs het water', next: 'moeras', fitsText: false },
      ],
      clue: 'Sla bij de holle boom rechtsaf, het smalle pad op.',
      structure: 'tijdvolgorde',
    },

    moeras: {
      kind: 'passage',
      chapter: 'Hoofdstuk 2',
      title: 'Natte voeten',
      image: '🐸',
      text: `Mila loopt verder langs het water. De grond wordt steeds zachter.

Plotseling zakt haar voet weg in de modder. Bah! Haar schoen is helemaal nat en vies. Een kikker kijkt haar verbaasd aan.

Nu weet Mila het weer: hier begint het moeras. De uil had gezegd dat ze bij de holle boom rechtsaf moest. Met een soppende schoen loopt ze terug en neemt het smalle pad.`,
      next: 'bruggen',
    },

    bruggen: {
      kind: 'decision',
      chapter: 'Hoofdstuk 3',
      title: 'Twee bruggen',
      image: '🌉',
      text: `Het smalle pad eindigt bij een brede rivier. Aan de overkant hoort Mila een zacht gemiauw. Pluis!

Er zijn twee bruggen. De houten brug is dichtbij, maar de planken zijn rot en er ontbreken er een paar. De stenen brug ligt een stukje verderop, maar hij is stevig en heeft een leuning.

Mila wil zo snel mogelijk naar Pluis. Maar ze wil ook veilig aan de overkant komen.`,
      question: 'Over welke brug gaat Mila?',
      choices: [
        { text: '🪵 De houten brug, die is dichterbij', next: 'houtenbrug', fitsText: false },
        { text: '🪨 De stenen brug, die is stevig', next: 'vos', fitsText: true },
      ],
      clue: 'De houten brug is dichtbij, maar de planken zijn rot en er ontbreken er een paar.',
      structure: 'vergelijken',
    },

    houtenbrug: {
      kind: 'passage',
      chapter: 'Hoofdstuk 3',
      title: 'Krak!',
      image: '🪵',
      text: `Mila stapt op de houten brug. De planken kraken onder haar voeten.

Halverwege hoort ze een harde KRAK. Een plank breekt en valt in de rivier! Mila springt net op tijd naar de volgende plank.

Met trillende benen komt ze aan de overkant. Dat was gevaarlijk. Ze had beter de stevige stenen brug kunnen nemen.`,
      next: 'vos',
    },

    vos: {
      kind: 'decision',
      chapter: 'Hoofdstuk 4',
      title: 'De vos in de braamstruik',
      image: '🦊',
      text: `Aan de overkant hoort Mila gejammer. Een kleine vos zit vast in een braamstruik. Zijn staart zit klem tussen de takken vol doornen.

"Als ik trek, prikken de doornen alleen maar dieper," zegt de vos verdrietig. "De takken moeten opzij geduwd worden, met iets waar de doornen niet doorheen prikken."

Mila kijkt in haar rugzak. Ze heeft een appel, een dikke tuinhandschoen en een stuk touw.`,
      question: 'Hoe helpt Mila de vos?',
      choices: [
        { text: '🍎 Ze geeft de vos haar appel', next: 'vosappel', fitsText: false },
        { text: '💪 Ze trekt de vos er snel uit', next: 'vostrek', fitsText: false },
        { text: '🧤 Ze duwt de takken opzij met de tuinhandschoen', next: 'vosgered', fitsText: true },
      ],
      clue: 'De takken moeten opzij geduwd worden, met iets waar de doornen niet doorheen prikken.',
      structure: 'probleem-oplossing',
    },

    vosappel: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een appel helpt niet',
      image: '🍎',
      text: `De vos eet de appel op. "Lekker," zegt hij, "maar ik zit nog steeds vast."

Mila denkt na. Wat had de vos gezegd? De takken moesten opzij, met iets waar de doornen niet doorheen prikken. Ze pakt haar tuinhandschoen en duwt de takken voorzichtig weg.

De vos is vrij! "Dank je," zegt hij. "Je kat zit in de hoge eik op de open plek. Maar wees voorzichtig: hij schrok vannacht van het onweer. Door de harde donder rende hij in paniek de boom in. Sindsdien is hij bang voor harde geluiden."`,
      next: 'eik',
    },

    vostrek: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Au!',
      image: '🦊',
      text: `Mila trekt aan de vos. "AU!" roept hij. De doornen prikken nog dieper in zijn staart.

"Niet trekken!" piept de vos. "De takken moeten opzij!" Mila schrikt. Ze pakt snel haar tuinhandschoen en duwt de takken voorzichtig weg.

De vos is vrij, maar zijn staart doet pijn. "Je kat zit in de hoge eik op de open plek," zegt hij een beetje mopperig. "Hij schrok vannacht van het onweer. Door de harde donder rende hij in paniek de boom in. Sindsdien is hij bang voor harde geluiden."`,
      next: 'eik',
    },

    vosgered: {
      kind: 'passage',
      chapter: 'Hoofdstuk 4',
      title: 'Een nieuwe vriend',
      image: '🦊',
      text: `Mila trekt de dikke tuinhandschoen aan en duwt de takken voorzichtig opzij. De doornen prikken niet door de handschoen heen.

Met één sprong is de vos vrij. "Dank je wel!" roept hij blij. "Ik weet waar je kat is. Hij zit in de hoge eik op de open plek."

"Maar wees voorzichtig," zegt de vos. "Hij schrok vannacht van het onweer. Door de harde donder rende hij in paniek de boom in. Sindsdien is hij bang voor harde geluiden."`,
      next: 'eik',
    },

    eik: {
      kind: 'decision',
      chapter: 'Hoofdstuk 5',
      title: 'Hoog in de eik',
      image: '🌳',
      text: `Op de open plek staat een enorme eik. Helemaal bovenin ziet Mila iets wits. Het is Pluis! Hij zit stil op een tak en trilt een beetje.

Mila wil hem zo graag naar beneden halen. Ze denkt aan wat de vos vertelde: Pluis rende de boom in omdat hij schrok van de harde donder.`,
      question: 'Hoe krijgt Mila Pluis naar beneden?',
      choices: [
        { text: '📣 Ze roept hard: "PLUIS, KOM HIER!"', next: 'roepen', fitsText: false },
        { text: '🌳 Ze schudt flink aan de boom', next: 'schudden', fitsText: false },
        { text: '🤫 Ze gaat zachtjes zitten en praat rustig tegen hem', next: 'rustig', fitsText: true },
      ],
      clue: 'Pluis rende de boom in omdat hij schrok van de harde donder.',
      structure: 'oorzaak-gevolg',
    },

    roepen: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Te hard!',
      image: '🙀',
      text: `"PLUIS, KOM HIER!" roept Mila zo hard als ze kan.

Pluis schrikt en klimt nog hoger. Oh nee! Natuurlijk, hij is bang voor harde geluiden.

Mila gaat stil zitten en wacht. Het duurt heel lang. Pas als de zon al laag staat, durft Pluis eindelijk naar beneden te klimmen.`,
    },

    schudden: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Ritselende bladeren',
      image: '🙀',
      text: `Mila schudt aan de boom. De bladeren ritselen en de takken kraken.

Pluis schrikt van het lawaai en klampt zich vast aan zijn tak. Hij blaast zelfs!

Mila stopt meteen. Ze gaat zitten en wacht rustig. Het duurt heel lang, maar uiteindelijk klimt Pluis voorzichtig naar beneden.`,
    },

    rustig: {
      kind: 'finale',
      chapter: 'Hoofdstuk 5',
      title: 'Zachtjes',
      image: '🐈',
      text: `Mila gaat zachtjes onder de boom zitten. "Hé Pluis," fluistert ze. "Het onweer is weg. Je bent veilig."

Pluis kijkt naar beneden. Zijn oren gaan omhoog. Dan klimt hij tak voor tak naar beneden en springt zo in haar armen.

Mila knuffelt hem stevig. "Ik heb je gevonden," zegt ze.`,
    },
  },

  endings: [
    {
      minScore: 5,
      title: 'Het geheime einde: de wenssteen',
      image: '✨',
      text: `Als Mila met Pluis naar huis wil lopen, begint er iets te fonkelen tussen de wortels van de eik. Het is een glinsterende steen.

De uil landt naast haar. "Dat is een wenssteen," zegt hij. "Hij verschijnt alleen voor mensen die heel goed luisteren. En jij hebt vandaag naar alles goed geluisterd."

De vos komt er ook bij. Samen lopen ze naar de rand van het bos. Mila is ruim op tijd thuis voor het eten, met Pluis in haar armen en een wenssteen in haar zak.`,
    },
    {
      minScore: 3,
      title: 'Thuis voor het donker',
      image: '🏡',
      text: `Mila loopt met Pluis in haar armen naar huis. Haar benen zijn moe van de lange tocht.

Net voor het donker wordt, ziet ze haar huis. Mama staat in de deuropening en zwaait. "Je hebt hem gevonden!"

Het was een spannende dag. Toch denkt Mila dat het misschien sneller had gekund, als ze overal net iets beter had opgelet.`,
    },
    {
      minScore: 0,
      title: 'Een lange, lange dag',
      image: '🌙',
      text: `Als Mila eindelijk thuiskomt, is het al donker. Haar schoenen zijn vies, ze is moe en mama was ongerust.

"Waar bleef je nou?" vraagt mama. Mila vertelt over haar avontuur. Het ging niet overal goed, maar Pluis is weer thuis.

Die avond in bed denkt Mila aan de uil en de vos. Hadden ze haar niet steeds aanwijzingen gegeven? Volgende keer gaat ze beter opletten.`,
    },
  ],
}
