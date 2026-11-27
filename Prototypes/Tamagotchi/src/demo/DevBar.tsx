import type { PagiApi } from "../pagi";

export interface LoggedEvent {
  id: number;
  text: string;
}

interface DevBarProps {
  send: PagiApi["emit"];
  eventLog: LoggedEvent[];
}

export function DevBar({ send, eventLog }: DevBarProps) {
  return (
    <aside className="devbar" aria-label="Demo-bediening">
      <p className="devbar-title">Demo-bediening (geen onderdeel van de app)</p>
      <div className="devbar-actions">
        <button type="button" onClick={() => send("demo_day")}>
          +1 schooldag
        </button>
        <button type="button" onClick={() => send("demo_reset")}>
          Opnieuw
        </button>
      </div>
      <p className="devbar-title">Laatste events naar Pagi</p>
      <ol className="devbar-log">
        {eventLog.map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ol>
    </aside>
  );
}
