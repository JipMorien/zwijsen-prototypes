/** What a child has achieved in one story, kept in this browser only. */
export type StoryProgress = {
  bestScore: number
  lastScore: number
  total: number
  timesRead: number
  secretEndingFound: boolean
  /** Variants of the last read, so the next read can use different ones. */
  lastVariants?: Record<string, number>
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const KEY = 'telltale-progress-v1'

function browserStorage(): StorageLike | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}

export function loadAllProgress(storage = browserStorage()): Record<string, StoryProgress> {
  try {
    const raw = storage?.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoryProgress>) : {}
  } catch {
    return {}
  }
}

export function loadProgress(storyId: string, storage = browserStorage()): StoryProgress | undefined {
  return loadAllProgress(storage)[storyId]
}

/** Records a finished read and returns the updated progress. Fails quietly when storage is unavailable. */
export function recordRead(
  storyId: string,
  result: { score: number; total: number; secretEnding: boolean; variants?: Record<string, number> },
  storage = browserStorage(),
): StoryProgress {
  const all = loadAllProgress(storage)
  const previous = all[storyId]
  const updated: StoryProgress = {
    bestScore: Math.max(previous?.bestScore ?? 0, result.score),
    lastScore: result.score,
    total: result.total,
    timesRead: (previous?.timesRead ?? 0) + 1,
    secretEndingFound: (previous?.secretEndingFound ?? false) || result.secretEnding,
    lastVariants: result.variants,
  }
  try {
    storage?.setItem(KEY, JSON.stringify({ ...all, [storyId]: updated }))
  } catch {
    // Private mode or blocked storage: progress just isn't kept.
  }
  return updated
}
