import { useState } from "react";
import type { PagiApi } from "../pagi";
import { lesson, type Sentence } from "./lesson";

interface SearchProps {
  send: PagiApi["emit"];
  onDone: () => void;
}

export function Search({ send, onDone }: SearchProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const finished = questionIndex >= lesson.questions.length;
  const question = lesson.questions[questionIndex];

  const tapSentence = (sentence: Sentence) => {
    if (finished || foundIds.includes(sentence.id)) return;
    if (sentence.id !== question.answerId) {
      setMissedIds([...missedIds, sentence.id]);
      send("evidence_missed", { signal: question.signal });
      return;
    }
    setFoundIds([...foundIds, sentence.id]);
    setMissedIds([]);
    send("evidence_found", { signal: question.signal });
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    if (nextIndex < lesson.questions.length) {
      const nextQuestion = lesson.questions[nextIndex];
      send("structure_question", {
        question: nextQuestion.question,
        signal: nextQuestion.signal,
      });
    }
  };

  const markOf = (sentence: Sentence) => {
    if (foundIds.includes(sentence.id)) return "sentence found";
    if (missedIds.includes(sentence.id)) return "sentence missed";
    return "sentence";
  };

  return (
    <article className="search">
      <p className="eyebrow">{lesson.label} · Speurtocht</p>
      <h2>{lesson.title}</h2>
      {finished ? (
        <div className="search-done">
          <p>Klaar! Je hebt alle antwoorden gevonden.</p>
          <button type="button" className="primary" onClick={onDone}>
            Terug naar het overzicht
          </button>
        </div>
      ) : (
        <p className="search-question">
          Vraag {questionIndex + 1}: {question.question}
          <span className="search-help">Tik op de zin met het antwoord.</span>
        </p>
      )}
      <div className="reading-text" data-pagi-perch="reading">
        {lesson.pages.map((sentences, pageIndex) => (
          <p key={pageIndex}>
            {sentences.map((sentence) => (
              <button
                key={sentence.id}
                type="button"
                className={markOf(sentence)}
                onClick={() => tapSentence(sentence)}
              >
                {sentence.text}
              </button>
            ))}
          </p>
        ))}
      </div>
    </article>
  );
}
