import { useEffect, useState } from "react";

const PERCH_SELECTOR = '[data-pagi-perch="reading"]';
const SITTING_WIDTH = 84;
const SITTING_HEIGHT = 111;
const INSET_FROM_PERCH_RIGHT = 16;
const FEET_OVERLAP = 12;
const VIEWPORT_MARGIN = 8;

export interface Placement {
  left: number;
  top: number;
}

function findPlacement(): Placement | null {
  const perch = document.querySelector(PERCH_SELECTOR);
  if (!perch) return null;
  const rect = perch.getBoundingClientRect();
  return {
    left: Math.max(
      VIEWPORT_MARGIN,
      rect.right - SITTING_WIDTH - INSET_FROM_PERCH_RIGHT,
    ),
    top: Math.max(VIEWPORT_MARGIN, rect.top - SITTING_HEIGHT + FEET_OVERLAP),
  };
}

/** Where Pagi sits on the reading text, or null when he should dock. */
export function usePlacement(wantsToSit: boolean): Placement | null {
  const [placement, setPlacement] = useState<Placement | null>(null);

  useEffect(() => {
    if (!wantsToSit) return;
    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setPlacement(findPlacement()));
    };
    const layoutObserver = new ResizeObserver(scheduleUpdate);
    layoutObserver.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      window.cancelAnimationFrame(frame);
      layoutObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate, { capture: true });
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [wantsToSit]);

  return wantsToSit ? placement : null;
}
