import { useRef, useState } from "react";
import type { PagiApi, View } from "../pagi";
import { DevBar, type LoggedEvent } from "./DevBar";
import { demoText, lesson } from "./lesson";
import { Overview } from "./Overview";
import { Reader } from "./Reader";
import { Search } from "./Search";
import { Toets } from "./Toets";

type Screen = "overview" | "reading" | "search" | "toets";

const PAGI_VIEW: Record<Screen, View> = {
  overview: "overview",
  reading: "reading",
  search: "reading",
  toets: "toets",
};

const EVENT_LOG_LENGTH = 6;

export function App() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [eventLog, setEventLog] = useState<LoggedEvent[]>([]);
  const nextLogId = useRef(0);

  const send: PagiApi["emit"] = (type, payload) => {
    window.Pagi?.emit(type, payload);
    const entry = {
      id: nextLogId.current++,
      type,
      payload: payload && JSON.stringify(payload),
    };
    setEventLog((log) => [entry, ...log].slice(0, EVENT_LOG_LENGTH));
  };

  const show = (next: Screen) => {
    setScreen(next);
    send("view_changed", { view: PAGI_VIEW[next] });
  };

  const openLesson = () => {
    show("reading");
    send("page_opened");
  };

  const startSearch = () => {
    show("search");
    const [firstQuestion] = lesson.questions;
    send("structure_question", {
      question: firstQuestion.text,
      signal: firstQuestion.signal,
    });
  };

  const openToets = () => {
    show("toets");
    send("quiet", { on: true });
  };

  const submitToets = () => {
    show("overview");
    send("quiet", { on: false });
  };

  return (
    <>
      <DevBar send={send} eventLog={eventLog} />
      <header className="app-header">
        <p className="brand">
          <strong>{demoText.brand}</strong>
          <span>{demoText.brandNote}</span>
        </p>
        <nav className="nav">
          {demoText.nav.map((item, index) => (
            <span key={item} data-current={index === 0 || undefined}>
              {item}
            </span>
          ))}
        </nav>
        <p className="pupil">{demoText.pupil}</p>
      </header>
      <main className="app-main">
        {screen === "overview" && (
          <Overview onStartLesson={openLesson} onStartToets={openToets} />
        )}
        {screen === "reading" && (
          <Reader
            send={send}
            onExit={() => show("overview")}
            onFinished={startSearch}
          />
        )}
        {screen === "search" && (
          <Search send={send} onDone={() => show("overview")} />
        )}
        {screen === "toets" && <Toets onSubmit={submitToets} />}
      </main>
    </>
  );
}
