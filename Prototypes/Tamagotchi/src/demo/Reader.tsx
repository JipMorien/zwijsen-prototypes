import { useState } from "react";
import type { PagiApi } from "../pagi";
import { demoText, lesson } from "./lesson";

interface ReaderProps {
  send: PagiApi["emit"];
  onExit: () => void;
  onFinished: () => void;
}

export function Reader({ send, onExit, onFinished }: ReaderProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = lesson.pages.length;
  const isLastPage = pageIndex === pageCount - 1;
  const pageText = lesson.pages[pageIndex].map(([, text]) => text).join(" ");

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
    <article>
      <div className="reader-bar">
        <button type="button" className="link" onClick={onExit}>
          {demoText.backToLessons}
        </button>
        <span className="meta">
          {demoText.pageOf(pageIndex + 1, pageCount)}
        </span>
      </div>
      <h1 className="page-title">{lesson.title}</h1>
      <progress
        className="progress"
        value={pageIndex + 1}
        max={pageCount}
        aria-label={demoText.pageOf(pageIndex + 1, pageCount)}
      />
      <div className="reading-text" data-pagi-perch="reading">
        <p>{pageText}</p>
      </div>
      <button type="button" className="button" onClick={goToNextPage}>
        {isLastPage ? demoText.toSearch : demoText.nextPage}
      </button>
    </article>
  );
}
