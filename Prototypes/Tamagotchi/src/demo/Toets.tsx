import type { FormEvent } from "react";

const QUESTIONS = [
  {
    name: "waar",
    question: "Waar staat de oude kist?",
    options: ["In de kelder", "Op de zolder", "In de schuur"],
  },
  {
    name: "olie",
    question: "Waarom gebruiken Noor en oma olie?",
    options: [
      "Om de kist te poetsen",
      "Om het roestige slot los te krijgen",
      "Om de sleutel schoon te maken",
    ],
  },
];

export function Toets({ onSubmit }: { onSubmit: () => void }) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="toets" onSubmit={handleSubmit}>
      <p className="eyebrow">Toets</p>
      <h2>De oude sleutel</h2>
      {QUESTIONS.map(({ name, question, options }) => (
        <fieldset key={name}>
          <legend>{question}</legend>
          {options.map((option) => (
            <label key={option}>
              <input type="radio" name={name} value={option} />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
      <button type="submit" className="primary">
        Inleveren
      </button>
    </form>
  );
}
