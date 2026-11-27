import { useCallback, useEffect, useReducer, useRef } from "react";
import type { KeyboardEvent } from "react";
import { listenForPagiEvents } from "../bus";
import { copy } from "../copy";
import { moodOf, reducer } from "../reducer";
import { restoreState, toSavedState, type PagiStorage } from "../storage";
import type { Animation, PagiAction, PagiState } from "../types";
import { Avatar } from "./Avatar";
import { Bubble } from "./Bubble";
import { Panel } from "./Panel";
import { usePlacement } from "./usePlacement";

interface Screen {
  state: PagiState;
  say?: string;
  sayId: number;
  animation?: Animation;
  animationId: number;
  actionCount: number;
}

interface TimedAction {
  action: PagiAction;
  now: number;
}

function advance(screen: Screen, { action, now }: TimedAction): Screen {
  const result = reducer(screen.state, action, now);
  return {
    state: result.state,
    say: result.say ?? screen.say,
    sayId: result.say ? screen.sayId + 1 : screen.sayId,
    animation: result.animation ?? screen.animation,
    animationId: result.animation ? screen.animationId + 1 : screen.animationId,
    actionCount: screen.actionCount + 1,
  };
}

function openScreen(storage: PagiStorage): Screen {
  return {
    state: restoreState(storage.load()),
    sayId: 0,
    animationId: 0,
    actionCount: 0,
  };
}

export function Pagi({ storage }: { storage: PagiStorage }) {
  const [screen, dispatch] = useReducer(advance, storage, openScreen);
  const { state } = screen;
  const avatarButton = useRef<HTMLButtonElement>(null);
  const placement = usePlacement(
    state.view === "reading" && !state.panelOpen,
    screen.actionCount,
  );

  const send = useCallback(
    (action: PagiAction) => dispatch({ action, now: Date.now() }),
    [],
  );

  useEffect(() => listenForPagiEvents(send), [send]);

  useEffect(() => storage.save(toSavedState(state)), [storage, state]);

  const closePanel = () => {
    send({ type: "panel_changed", open: false });
    avatarButton.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && state.panelOpen) closePanel();
  };

  return (
    <div
      className="pagi"
      data-placement={placement ? "sitting" : "docked"}
      style={placement ?? undefined}
      hidden={state.quiet}
      onKeyDown={handleKeyDown}
    >
      <Bubble message={screen.say} messageId={screen.sayId} />
      {state.panelOpen && (
        <Panel
          state={state}
          onFeed={() => send({ type: "feed" })}
          onPet={() => send({ type: "pet" })}
          onClose={closePanel}
        />
      )}
      <button
        ref={avatarButton}
        type="button"
        className="pagi-avatar"
        aria-label={copy.panel.open}
        aria-expanded={state.panelOpen}
        onClick={() => send({ type: "panel_changed", open: !state.panelOpen })}
      >
        <span
          key={screen.animationId}
          className="pagi-jump"
          data-animation={screen.animation}
        >
          <Avatar mood={moodOf(state)} lookingDown={placement !== null} />
        </span>
      </button>
    </div>
  );
}
