import type { PagiApi, PagiEvent, View } from "./types";

const EVENT_NAME = "pagi";
const VIEWS: readonly View[] = ["overview", "reading", "toets"];

declare global {
  interface Window {
    Pagi?: PagiApi;
  }
}

export const emitPagiEvent: PagiApi["emit"] = (type, payload) => {
  const detail = JSON.stringify({ type, ...payload });
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
};

function readDetail(detail: unknown): unknown {
  if (typeof detail !== "string") return detail;
  try {
    return JSON.parse(detail);
  } catch {
    return null;
  }
}

function isView(value: unknown): value is View {
  return VIEWS.some((view) => view === value);
}

// Host apps are not type-checked against Pagi, so every field is verified.
function parsePagiEvent(detail: unknown): PagiEvent | null {
  const value = readDetail(detail);
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return null;
  }
  switch (value.type) {
    case "view_changed":
      return "view" in value && isView(value.view)
        ? { type: "view_changed", view: value.view }
        : null;
    case "page_opened":
    case "page_read":
    case "demo_day":
    case "demo_reset":
      return { type: value.type };
    case "structure_question":
      return "question" in value &&
        typeof value.question === "string" &&
        "signal" in value &&
        typeof value.signal === "string"
        ? {
            type: "structure_question",
            question: value.question,
            signal: value.signal,
          }
        : null;
    case "evidence_found":
    case "evidence_missed":
      return "signal" in value && typeof value.signal === "string"
        ? { type: value.type, signal: value.signal }
        : null;
    case "quiet":
      return "on" in value && typeof value.on === "boolean"
        ? { type: "quiet", on: value.on }
        : null;
    default:
      return null;
  }
}

export function listenForPagiEvents(
  onEvent: (event: PagiEvent) => void,
): () => void {
  const handleEvent = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const pagiEvent = parsePagiEvent(event.detail);
    if (pagiEvent) onEvent(pagiEvent);
  };
  window.addEventListener(EVENT_NAME, handleEvent);
  return () => window.removeEventListener(EVENT_NAME, handleEvent);
}
