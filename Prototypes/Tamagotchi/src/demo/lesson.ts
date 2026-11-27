export const lesson = {
  label: "Les 12",
  title: "De oude sleutel",
  avi: "AVI E5",
  pages: [
    [
      ["s1", "Sam vond een oude sleutel onder de trap."],
      ["s2", "Hij was zwaar en een beetje roestig."],
      ["s3", "Eerst poetste Sam de sleutel schoon met een doek."],
      ["s4", "Daarna zag hij een letter op het handvat: een O."],
    ],
    [
      ["s5", "‘O van opa!’ riep Sam."],
      [
        "s6",
        "Omdat opa een grote kist op zolder had, dacht Sam dat de sleutel daarvan was.",
      ],
      ["s7", "Samen met zijn zus Noor klom hij de smalle trap op."],
      ["s8", "Het was stoffig en in de hoek hing een spinnenweb."],
    ],
    [
      ["s9", "Het slot van de kist zat vast."],
      ["s10", "Daarom deed Noor een druppel olie op de sleutel."],
      ["s11", "Klik! Het deksel ging krakend open."],
      [
        "s12",
        "Doordat de kist zo lang dicht had gezeten, rook alles naar oud papier.",
      ],
      [
        "s13",
        "In de kist lag een schrift: ‘Mijn grootste avontuur, door opa Kees.’",
      ],
    ],
  ],
  questions: [
    {
      answer: "s6",
      signal: "omdat",
      text: "Waarom dacht Sam dat de sleutel van de kist op zolder was?",
    },
    {
      answer: "s3",
      signal: "eerst",
      text: "Wat deed Sam vóórdat hij de letter op de sleutel zag?",
    },
  ],
} as const;

export const toets = [
  {
    question: "1. Wat is een kapitein?",
    options: ["De baas van een schip", "Een soort vis"],
  },
  {
    question: "2. Wat doet een vuurtoren?",
    options: ["Schepen waarschuwen", "Vis vangen"],
  },
] as const;

export type Sentence = (typeof lesson.pages)[number][number];

export const demoText = {
  brand: "Leesplein",
  brandNote: "dummy leesomgeving",
  nav: ["Mijn lessen", "Boekenkast", "Resultaten"],
  pupil: "Sem · groep 5",
  greeting: "Goedemiddag",
  lessonMeta: `${lesson.label} · ${lesson.avi}`,
  lessonSummary: `${lesson.pages.length} pagina's · speurtocht met ${lesson.questions.length} vragen`,
  startLesson: "Start les",
  toetsMeta: "Toets · Thema Zee",
  toetsTitle: "Woordenschat-toets",
  startToets: "Start toets",
  submitToets: "Toets inleveren",
  backToLessons: "← Mijn lessen",
  pageOf: (page: number, total: number) => `Pagina ${page} van ${total}`,
  nextPage: "Volgende pagina",
  toSearch: "Naar de speurtocht",
  searchLabel: "Pagi's speurtocht",
  searchHelp: "Tik op de zin waar het antwoord staat.",
  wrongPlace: "Dat is niet de goede plek. Kijk naar de tip van Pagi.",
  nextQuestion: "Volgende vraag",
  finishLesson: "Les afronden",
  devbarLabel: "Demo-bediening",
  nextDay: "+1 schooldag",
  reset: "Opnieuw",
};
