import { useState } from "react";
import type { PagiApi } from "../pagi";
import { lesson } from "./lesson";

interface ReaderProps {
  send: PagiApi["emit"];
  onFinished: () => void;
}

export function Reader({ send, onFinished }: ReaderProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const sentences = lesson.pages[pageIndex];
  const isLastPage = pageIndex === lesson.pages.length - 1;

  const goToNextPage = () => {
    send("page_read");
    if (isLastPage) {
      onFinished();
      return;
    }
    setPageIndex(pageIndex + 1);
    send("page_opened");
  };

  return (
    <article className="reader">
      <p className="eyebrow">
        {lesson.label} · Pagina {pageIndex + 1} van {lesson.pages.length}
      </p>
      <h2>{lesson.title}</h2>
      <div className="reading-text" data-pagi-perch="reading">
        <p>{sentences.map((sentence) => sentence.text).join(" ")}</p>
      </div>
      <button type="button" className="primary" onClick={goToNextPage}>
        Volgende pagina
      </button>
    </article>
  );
}
