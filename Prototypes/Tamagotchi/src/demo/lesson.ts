export interface Sentence {
  id: string;
  text: string;
}

export interface SearchQuestion {
  structure: "oorzaak" | "tijd";
  question: string;
  signal: string;
  answerId: string;
}

export const lesson = {
  label: "Les 12",
  title: "De oude sleutel",
  pages: [
    [
      { id: "s1", text: "Op de zolder van oma staat een oude houten kist." },
      { id: "s2", text: "Noor wil al heel lang weten wat erin zit." },
      {
        id: "s3",
        text: "Toen ze op een regenachtige middag de zolder opruimde, vond ze onder een stapel kranten een kleine, roestige sleutel.",
      },
    ],
    [
      { id: "s4", text: "Noor rende met de sleutel naar de kist." },
      {
        id: "s5",
        text: "Ze stak hem in het slot en draaide, maar er gebeurde niets.",
      },
      {
        id: "s6",
        text: "De kist bleef dicht, omdat het slot helemaal vastgeroest was.",
      },
      { id: "s7", text: "Noor zuchtte en liep naar beneden." },
    ],
    [
      { id: "s8", text: "Oma moest lachen toen ze het verhaal hoorde." },
      { id: "s9", text: "Ze pakte een flesje olie uit de keukenla." },
      { id: "s10", text: "Samen druppelden ze wat olie in het slot." },
      { id: "s11", text: "Met een zachte klik sprong de kist open." },
      {
        id: "s12",
        text: "Bovenin lag een brief die oma schreef toen ze net zo oud was als Noor.",
      },
    ],
  ] satisfies Sentence[][],
  questions: [
    {
      structure: "oorzaak",
      question: "Waarom ging de kist niet open?",
      signal: "omdat",
      answerId: "s6",
    },
    {
      structure: "tijd",
      question: "Wanneer vond Noor de sleutel?",
      signal: "toen",
      answerId: "s3",
    },
  ] satisfies SearchQuestion[],
};
