import { Fragment, useState, type KeyboardEvent } from "react";
import type { PagiApi } from "../pagi";
import { demoText, lesson, type Sentence } from "./lesson";

interface SearchProps {
  send: PagiApi["emit"];
  onDone: () => void;
}

export function Search({ send, onDone }: SearchProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const question = lesson.questions[questionIndex];
  const answered = foundIds.includes(question.answer);
  const isLastQuestion = questionIndex === lesson.questions.length - 1;

  const tapSentence = ([id]: Sentence) => {
    if (answered) return;
    if (id === question.answer) {
      setFoundIds([...foundIds, id]);
      send("evidence_found", { signal: question.signal });
    } else {
      setMissedIds([...missedIds, id]);
      send("evidence_missed", { signal: question.signal });
    }
  };

  const handleSentenceKey = (event: KeyboardEvent, sentence: Sentence) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    tapSentence(sentence);
  };

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      onDone();
      return;
    }
    const nextQuestion = lesson.questions[questionIndex + 1];
    setQuestionIndex(questionIndex + 1);
    setMissedIds([]);
    send("structure_question", {
      question: nextQuestion.text,
      signal: nextQuestion.signal,
    });
  };

  const stateOf = ([id]: Sentence) => {
    if (foundIds.includes(id)) return "found";
    if (missedIds.includes(id)) return "missed";
    return undefined;
  };

  return (
    <article>
      <h1 className="page-title">{lesson.title}</h1>
      <section className="question-card">
        <p className="question-label">{demoText.searchLabel}</p>
        <p className="question-text">{question.text}</p>
        <p className="meta">{demoText.searchHelp}</p>
        {missedIds.length > 0 && !answered && (
          <p className="question-wrong">{demoText.wrongPlace}</p>
        )}
        {answered && (
          <button type="button" className="button" onClick={goToNextQuestion}>
            {isLastQuestion ? demoText.finishLesson : demoText.nextQuestion}
          </button>
        )}
      </section>
      <div className="reading-text" data-pagi-perch="reading">
        {lesson.pages.map((sentences, pageIndex) => (
          <p key={pageIndex}>
            {sentences.map((sentence) => (
              <Fragment key={sentence[0]}>
                <span
                  role="button"
                  tabIndex={0}
                  className="sentence"
                  data-state={stateOf(sentence)}
                  onClick={() => tapSentence(sentence)}
                  onKeyDown={(event) => handleSentenceKey(event, sentence)}
                >
                  {sentence[1]}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </article>
  );
}
