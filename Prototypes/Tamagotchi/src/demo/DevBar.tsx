import type { PagiApi } from "../pagi";
import { demoText } from "./lesson";

export interface LoggedEvent {
  id: number;
  type: string;
  payload?: string;
}

interface DevBarProps {
  send: PagiApi["emit"];
  eventLog: LoggedEvent[];
}

export function DevBar({ send, eventLog }: DevBarProps) {
  return (
    <aside className="devbar" aria-label={demoText.devbarLabel}>
      <div className="devbar-actions">
        <button type="button" onClick={() => send("demo_day")}>
          {demoText.nextDay}
        </button>
        <button type="button" onClick={() => send("demo_reset")}>
          {demoText.reset}
        </button>
      </div>
      <ol className="devbar-log">
        {eventLog.map((entry) => (
          <li key={entry.id}>
            <span className="devbar-event">{entry.type}</span>
            {entry.payload && ` ${entry.payload}`}
          </li>
        ))}
      </ol>
    </aside>
  );
}
