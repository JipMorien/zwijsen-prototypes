export const copy = {
  name: "Pagi",
  avatarLabel: "Pagi, tik om te verzorgen",
  readTooFast:
    "Hé, dat ging wel heel snel! Lees de pagina rustig, dan smaakt het beter.",
  pageRead: "Mmm, een woordbrokje! Dank je wel voor het lezen.",
  wokeUp: "Hè? Ik werd wakker van je lezen. Fijn dat je er bent!",
  evidenceFound: (signal: string) =>
    `Ja, gevonden! Het woordje "${signal}" verraadde het. Een ster voor jou!`,
  evidenceMissed: (signal: string) =>
    `Bijna! Zoek eens naar het woordje "${signal}".`,
  fellAsleep: "Ik ben zo moe... Ik doe even mijn ogen dicht.",
  asleep: "Pagi slaapt. Lees één pagina, dan wordt hij wakker.",
  fed: "Mmm, smullen! Mijn buik is weer wat voller.",
  noWordBites:
    "Je hebt nog geen woordbrokjes. Lees een pagina, dan krijg je er een.",
  petted: "Hihi, dat kriebelt!",
  wordBites: "Woordbrokjes",
  stars: "Sterren",
  needs: { food: "Honger", energy: "Energie", joy: "Blij" },
  feed: "Voeren",
  pet: "Aaien",
  close: "Sluiten",
};
