import type { FormEvent } from "react";
import { demoText, toets } from "./lesson";

export function Toets({ onSubmit }: { onSubmit: () => void }) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="toets" onSubmit={handleSubmit}>
      <p className="meta">{demoText.toetsMeta}</p>
      <h1 className="page-title">{demoText.toetsTitle}</h1>
      {toets.map(({ question, options }) => (
        <fieldset key={question}>
          <legend>{question}</legend>
          {options.map((option) => (
            <label key={option}>
              <input type="radio" name={question} value={option} />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
      <button type="submit" className="button">
        {demoText.submitToets}
      </button>
    </form>
  );
}
