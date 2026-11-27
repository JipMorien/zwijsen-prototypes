export type View = "overview" | "reading" | "toets";

export interface Needs {
  food: number;
  energy: number;
  joy: number;
}

export type Mood = "blij" | "honger" | "slaapt";

export type Animation = "juich";

export interface PagiState {
  needs: Needs;
  wordBites: number;
  stars: number;
  sleeping: boolean;
  panelOpen: boolean;
  view: View;
  quiet: boolean;
  pageOpenedAt: number | null;
}

export type SavedState = Pick<
  PagiState,
  "needs" | "wordBites" | "stars" | "sleeping"
>;

export type PagiEvent =
  | { type: "view_changed"; view: View }
  | { type: "page_opened" }
  | { type: "page_read" }
  | { type: "structure_question"; question: string; signal: string }
  | { type: "evidence_found"; signal: string }
  | { type: "evidence_missed"; signal: string }
  | { type: "quiet"; on: boolean }
  | { type: "demo_day" }
  | { type: "demo_reset" };

export type PanelAction =
  { type: "feed" } | { type: "pet" } | { type: "panel_changed"; open: boolean };

export type PagiAction = PagiEvent | PanelAction;

export type PagiEventPayload<T extends PagiEvent["type"]> = Omit<
  Extract<PagiEvent, { type: T }>,
  "type"
>;

export interface PagiApi {
  emit<T extends PagiEvent["type"]>(
    type: T,
    payload?: PagiEventPayload<T>,
  ): void;
}

export interface PagiResult {
  state: PagiState;
  say?: string;
  animation?: Animation;
}
