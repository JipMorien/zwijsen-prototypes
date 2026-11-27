import { demoText, lesson } from "./lesson";

interface OverviewProps {
  onStartLesson: () => void;
  onStartToets: () => void;
}

export function Overview({ onStartLesson, onStartToets }: OverviewProps) {
  return (
    <>
      <h1 className="page-title">{demoText.greeting}</h1>
      <div className="cards">
        <section className="card">
          <p className="meta">{demoText.lessonMeta}</p>
          <h2>{lesson.title}</h2>
          <p className="meta">{demoText.lessonSummary}</p>
          <button type="button" className="button" onClick={onStartLesson}>
            {demoText.startLesson}
          </button>
        </section>
        <section className="card">
          <p className="meta">{demoText.toetsMeta}</p>
          <h2>{demoText.toetsTitle}</h2>
          <button
            type="button"
            className="button"
            data-variant="secondary"
            onClick={onStartToets}
          >
            {demoText.startToets}
          </button>
        </section>
      </div>
    </>
  );
}
