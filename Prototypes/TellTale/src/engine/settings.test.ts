import { describe, expect, it } from 'vitest'
import { stories } from '../prototype-data/stories'
import { soundscapeFor } from '../ui/ambience'
import { recordRead } from './progress'
import { duskLevel, REREAD_COST } from './reading'
import { cleanName, loadName, loadSound, saveName, saveSound } from './settings'
import { READER_DEFAULT, renderText, storyVars, type Decision } from './story'

const memory = () => {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  }
}

describe('the reader’s name', () => {
  it('is tidied up', () => {
    expect(cleanName('  sam   de  vries ')).toBe('Sam de vries')
    expect(cleanName('   ')).toBe('')
    expect(cleanName('a'.repeat(40))).toHaveLength(20)
  })

  it('is remembered, and forgotten when cleared', () => {
    const storage = memory()
    expect(saveName('noor', storage)).toBe('Noor')
    expect(loadName(storage)).toBe('Noor')
    saveName('', storage)
    expect(loadName(storage)).toBe('')
    expect(loadName(undefined)).toBe('')
  })

  it('appears in the story, or "speurder" when there is no name', () => {
    const story = stories[0]
    const text = 'Help jij me zoeken, {naam}?'
    expect(renderText(text, storyVars(story, {}, 'Noor'), new Set())).toBe('Help jij me zoeken, Noor?')
    expect(renderText(text, storyVars(story, {}), new Set())).toBe(`Help jij me zoeken, ${READER_DEFAULT}?`)
  })
})

describe('sound', () => {
  it('is off until the child turns it on', () => {
    const storage = memory()
    expect(loadSound(storage)).toBe(false)
    saveSound(true, storage)
    expect(loadSound(storage)).toBe(true)
  })

  it('follows the scene, with crickets in the forest when it gets dark', () => {
    expect(soundscapeFor('stream', 0)).toBe('water')
    expect(soundscapeFor('forest', 0.2)).toBe('bos')
    expect(soundscapeFor('forest', 0.9)).toBe('avond')
    expect(soundscapeFor('home', 0.9)).toBe('stil')
  })
})

describe('reading a part again', () => {
  const decided = (...fits: boolean[]): Decision[] => fits.map(fitsText => ({ nodeId: 'n', choiceIndex: 0, fitsText }))

  it('costs a little time, but less than a wrong choice', () => {
    const base = duskLevel(decided(true, true), 5)
    expect(duskLevel(decided(true, true), 5, 1)).toBeCloseTo(base + REREAD_COST)
    expect(REREAD_COST).toBeLessThan(0.65 / 5)
  })

  it('is saved for the teacher', () => {
    const storage = memory()
    const progress = recordRead('s', { score: 3, total: 5, secretEnding: false, rereads: 2 }, storage)
    expect(progress.lastRereads).toBe(2)
  })
})
