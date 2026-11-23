import type { Story } from "../types/story";


export const fluisterbos: Story = {
  id: 'fluisterbos',
  title: 'Het geheim van het Fluisterbos',
  description: 'Help Mila haar kat terug te vinden in een mysterieus bos.',
  emoji: '🌳',
  category: 'Avontuur',
  time: '5 minuten',
  available: true,
  startNode: 'start',

  nodes: {
    start: {
      chapter: 'Hoofdstuk 1',
      title: 'Het geheim van het Fluisterbos',
      image: '🌳',
      text: `Op een zonnige ochtend wandelt Mila door het Fluisterbos. Ze is op zoek naar haar verdwenen kat, Pluis.

Plotseling hoort ze geritsel achter een grote boom. Ze stopt en luistert goed.

"Help! Is daar iemand?" klinkt een zacht stemmetje.

Mila kijkt om zich heen. Ze ziet twee dingen: een klein paadje dat dieper het bos in loopt en een donker gat onder de boom.

Wat zou ze doen?`,
      question: 'Waar denk je dat het stemmetje vandaan komt?',
      choices: [
        { text: '🌿 Volg het kleine paadje', next: 'path' },
        { text: '🕳️ Kijk in het donkere gat', next: 'hole' }
      ]
    },

    path: {
      chapter: 'Hoofdstuk 2A',
      title: 'Het mysterieuze paadje',
      image: '🦊',
      text: `Mila loopt voorzichtig over het smalle paadje. Tussen de struiken ziet ze kleine pootafdrukken.

Ze herkent ze meteen! Het zijn de pootafdrukken van Pluis.

Even later komt ze bij een open plek. Daar zit een kleine vos met een gewonde poot.

"Heb jij misschien een witte kat gezien?" vraagt Mila.

De vos knikt. "Ja! Hij ging richting de oude brug. Maar ik kan niet lopen. Wil je me helpen?"

Mila twijfelt even. Ze wil Pluis vinden, maar de vos heeft haar hulp nodig.`,
      question: 'Waarom twijfelt Mila?',
      choices: [
        { text: '❤️ Ze helpt eerst de vos', next: 'fox' },
        { text: '🏃 Ze rent direct naar de brug', next: 'bridge' }
      ]
    },

    hole: {
      chapter: 'Hoofdstuk 2B',
      title: 'Het donkere geheim',
      image: '🦉',
      text: `Mila knielt bij het donkere gat onder de boom.

Plotseling verschijnen er twee grote, gele ogen!

Het is een kleine uil. Hij kijkt verdrietig.

"Ik ben mijn nest kwijtgeraakt," piept de uil. "Ik zag een witte kat voorbijrennen. Hij ging naar de oude brug."

Mila kijkt omhoog. Boven in de boom hangt een klein nest dat bijna naar beneden valt.

De uil vraagt of Mila wil helpen.`,
      question: 'Welke belangrijke aanwijzing geeft de uil?',
      choices: [
        { text: '🪺 Help de uil met zijn nest', next: 'owl' },
        { text: '🌉 Ga meteen naar de oude brug', next: 'secret' }
      ]
    },

    fox: {
      chapter: 'Einde 1',
      title: 'Een nieuwe vriend',
      image: '🦊',
      ending: true,
      text: `Mila vindt een groot blad en gebruikt het om de poot van de vos te verbinden.

"Bedankt!" zegt de vos blij.

Als dank brengt hij Mila naar de oude brug. Daar zit Pluis rustig te wachten.

Mila knuffelt haar kat en glimlacht. Ze heeft niet alleen Pluis gevonden, maar ook een nieuwe vriend gemaakt!`,
      reflection: 'Waarom was de vos zo blij met Mila?'
    },

    bridge: {
      chapter: 'Einde 2',
      title: 'Net op tijd!',
      image: '🐈',
      ending: true,
      text: `Mila rent zo snel als ze kan naar de oude brug.

Daar hoort ze een bekend gemiauw. Pluis zit op een boomstronk!

"Daar ben je!" roept Mila opgelucht.

Ze tilt Pluis op en loopt samen met hem naar huis. Onderweg denkt ze nog aan de vos die ze heeft achtergelaten.`,
      reflection: 'Waarom denkt Mila onderweg nog aan de vos?'
    },

    owl: {
      chapter: 'Einde 3',
      title: 'De uil is gered',
      image: '🦉',
      ending: true,
      text: `Mila klimt voorzichtig op een lage tak en duwt het nest terug op zijn plek.

De uil fladdert blij rond haar hoofd.

"Je bent een echte held!" roept hij.

Als dank wijst hij Mila de weg naar de oude brug. Daar vindt ze Pluis, die vrolijk naar haar toe rent.

Wat een bijzondere dag!`,
      reflection: 'Hoe heeft de uil Mila geholpen nadat zij hem hielp?'
    },

    secret: {
      chapter: 'Einde 4',
      title: 'Een onverwachte verrassing',
      image: '✨',
      ending: true,
      text: `Mila rent naar de oude brug. Daar vindt ze Pluis naast een glinsterende steen.

Maar de steen begint plotseling te fonkelen!

De uil vliegt achter Mila aan en landt naast de steen.

"Dat is een wenssteen," zegt hij. "Hij verschijnt alleen voor mensen die goed luisteren."

Mila glimlacht. Ze heeft haar kat teruggevonden én een magisch geheim ontdekt!`,
      reflection: 'Waarom verscheen de wenssteen volgens de uil?'
    }
  }
}
