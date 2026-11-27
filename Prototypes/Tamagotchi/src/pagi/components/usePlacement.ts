import { useEffect, useState } from "react";
import { PERCH_INSET, PERCH_OVERLAP, SITTING_SIZE } from "../config";

const PERCH_SELECTOR = '[data-pagi-perch="reading"]';

export interface Placement {
  left: number;
  top: number;
}

function findPlacement(): Placement | null {
  const perch = document.querySelector(PERCH_SELECTOR);
  if (!perch) return null;
  const rect = perch.getBoundingClientRect();
  const top = rect.top - SITTING_SIZE.height + PERCH_OVERLAP;
  const left = rect.right - PERCH_INSET - SITTING_SIZE.width;
  const onScreen =
    top >= 0 &&
    top + SITTING_SIZE.height <= window.innerHeight &&
    left >= 0 &&
    left + SITTING_SIZE.width <= window.innerWidth;
  return onScreen ? { left, top } : null;
}

export function usePlacement(
  wantsToSit: boolean,
  layoutVersion: number,
): Placement | null {
  const [placement, setPlacement] = useState<Placement | null>(null);

  useEffect(() => {
    if (!wantsToSit) return;
    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setPlacement(findPlacement()));
    };
    window.addEventListener("scroll", scheduleUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate, { capture: true });
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [wantsToSit, layoutVersion]);

  return wantsToSit ? placement : null;
}
