import { describe, expect, it } from "vitest";
import { INITIAL_STATE, MIN_READ_MS, NEED_MAX, READ_ENERGY } from "./config";
import { moodOf, reducer } from "./reducer";
import type { PagiAction, PagiState } from "./types";

const START = 1_000_000;

function run(actions: PagiAction[], state = INITIAL_STATE): PagiState {
  return actions.reduce(
    (current, action) => reducer(current, action, START).state,
    state,
  );
}

function repeat(action: PagiAction, times: number): PagiAction[] {
  return Array.from({ length: times }, () => action);
}

function readPageAfter(state: PagiState, readingMs: number): PagiState {
  const opened = reducer(state, { type: "page_opened" }, START).state;
  return reducer(opened, { type: "page_read" }, START + readingMs).state;
}

function asleepState(): PagiState {
  return run(repeat({ type: "demo_day" }, 4));
}

describe("reducer", () => {
  it("gives nothing for a page read too early", () => {
    const state = readPageAfter(INITIAL_STATE, MIN_READ_MS - 1);
    expect(state.wordBites).toBe(INITIAL_STATE.wordBites);
    expect(state.needs).toEqual(INITIAL_STATE.needs);
  });

  it("gives one word bite and energy for a page read in time", () => {
    const state = readPageAfter(INITIAL_STATE, MIN_READ_MS);
    expect(state.wordBites).toBe(INITIAL_STATE.wordBites + 1);
    expect(state.needs.energy).toBe(INITIAL_STATE.needs.energy + READ_ENERGY);
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

  it("puts Pagi to sleep after four school days", () => {
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

  it("keeps every need between 0 and 100", () => {
    const pampered = run(
      [...repeat({ type: "feed" }, 10), ...repeat({ type: "pet" }, 20)],
      { ...INITIAL_STATE, wordBites: 10 },
    );
    expect(pampered.needs.food).toBe(NEED_MAX);
    expect(pampered.needs.joy).toBe(NEED_MAX);

    const neglected = run(repeat({ type: "demo_day" }, 10));
    expect(Object.values(neglected.needs)).toEqual([0, 0, 0]);
  });
});
