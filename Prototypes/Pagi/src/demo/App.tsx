import { useRef, useState } from "react";
import type { PagiApi, View } from "../pagi";
import { DevBar, type LoggedEvent } from "./DevBar";
import { lesson } from "./lesson";
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

const EVENT_LOG_LENGTH = 8;

export function App() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [eventLog, setEventLog] = useState<LoggedEvent[]>([]);
  const nextLogId = useRef(0);

  const send: PagiApi["emit"] = (type, payload) => {
    window.Pagi?.emit(type, payload);
    const text = payload ? `${type} ${JSON.stringify(payload)}` : type;
    const entry = { id: nextLogId.current++, text };
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
      question: firstQuestion.question,
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
    <div className="app">
      <header className="app-header">
        <h1>Leesplein (dummy)</h1>
      </header>
      <main className="app-main">
        {screen === "overview" && (
          <div className="cards">
            <section className="card">
              <p className="eyebrow">{lesson.label}</p>
              <h2>{lesson.title}</h2>
              <button type="button" className="primary" onClick={openLesson}>
                Start les
              </button>
            </section>
            <section className="card">
              <p className="eyebrow">Toets</p>
              <h2>{lesson.title}</h2>
              <button type="button" className="primary" onClick={openToets}>
                Start toets
              </button>
            </section>
          </div>
        )}
        {screen === "reading" && (
          <Reader send={send} onFinished={startSearch} />
        )}
        {screen === "search" && (
          <Search send={send} onDone={() => show("overview")} />
        )}
        {screen === "toets" && <Toets onSubmit={submitToets} />}
      </main>
      <DevBar send={send} eventLog={eventLog} />
    </div>
  );
}
