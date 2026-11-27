import { describe, expect, it } from "vitest";
import { INITIAL_STATE, MIN_READ_MS } from "./config";
import { moodOf, reducer } from "./reducer";
import type { PagiAction, PagiState } from "./types";

const START = 1_000_000;

function run(actions: PagiAction[], state = INITIAL_STATE): PagiState {
  return actions.reduce(
    (current, action) => reducer(current, action, START).state,
    state,
  );
}

function readPageAfter(state: PagiState, readingMs: number): PagiState {
  const opened = reducer(state, { type: "page_opened" }, START).state;
  return reducer(opened, { type: "page_read" }, START + readingMs).state;
}

function asleepState(): PagiState {
  const schoolDays: PagiAction[] = Array.from({ length: 4 }, () => ({
    type: "demo_day",
  }));
  return run(schoolDays);
}

describe("reducer", () => {
  it("gives nothing for a page read too early", () => {
    const state = readPageAfter(INITIAL_STATE, MIN_READ_MS - 1);
    expect(state.wordBites).toBe(INITIAL_STATE.wordBites);
    expect(state.needs).toEqual(INITIAL_STATE.needs);
  });

  it("gives one word bite for a page read in time", () => {
    const state = readPageAfter(INITIAL_STATE, MIN_READ_MS);
    expect(state.wordBites).toBe(INITIAL_STATE.wordBites + 1);
  });

  it("gives one star for found evidence", () => {
    const state = run([{ type: "evidence_found", signal: "omdat" }]);
    expect(state.stars).toBe(INITIAL_STATE.stars + 1);
  });

  it("changes nothing for missed evidence", () => {
    const state = run([{ type: "evidence_missed", signal: "omdat" }]);
    expect(state).toEqual(INITIAL_STATE);
  });

  it("changes nothing when feeding without word bites", () => {
    const withoutBites = { ...INITIAL_STATE, wordBites: 0 };
    expect(run([{ type: "feed" }], withoutBites)).toEqual(withoutBites);
  });

  it("puts Pagi to sleep after enough school days", () => {
    const state = asleepState();
    expect(state.sleeping).toBe(true);
    expect(moodOf(state)).toBe("slaapt");
  });

  it("wakes Pagi when a page is read", () => {
    const state = readPageAfter(asleepState(), MIN_READ_MS);
    expect(state.sleeping).toBe(false);
  });

  it("changes nothing when feeding while asleep", () => {
    const asleep = asleepState();
    expect(run([{ type: "feed" }], asleep)).toEqual(asleep);
  });
});
