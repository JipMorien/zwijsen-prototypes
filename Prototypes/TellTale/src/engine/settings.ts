/** The child's own settings: their name and whether background sound is on. Kept in this browser only. */

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const NAME_KEY = 'telltale-reader'
const SOUND_KEY = 'telltale-sound'
export const MAX_NAME_LENGTH = 20

function browserStorage(): StorageLike | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}

/** Tidies a typed name: no extra spaces, not too long, first letter a capital. Empty when nothing useful. */
export function cleanName(name: string): string {
  const trimmed = name.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH).trim()
  return trimmed ? trimmed[0].toLocaleUpperCase('nl') + trimmed.slice(1) : ''
}

export function loadName(storage = browserStorage()): string {
  try {
    return cleanName(storage?.getItem(NAME_KEY) ?? '')
  } catch {
    return ''
  }
}

export function saveName(name: string, storage = browserStorage()): string {
  const clean = cleanName(name)
  try {
    if (clean) storage?.setItem(NAME_KEY, clean)
    else storage?.removeItem(NAME_KEY)
  } catch {
    // Storage blocked: the name just isn't remembered.
  }
  return clean
}

/** Sound is off unless the child turned it on: a classroom is not the place for surprise noise. */
export function loadSound(storage = browserStorage()): boolean {
  try {
    return storage?.getItem(SOUND_KEY) === 'on'
  } catch {
    return false
  }
}

export function saveSound(on: boolean, storage = browserStorage()): void {
  try {
    storage?.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    // Storage blocked: the setting just isn't remembered.
  }
}
