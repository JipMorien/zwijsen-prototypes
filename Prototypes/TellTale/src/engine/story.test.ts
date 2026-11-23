import { describe, expect, it } from 'vitest'
import { stories } from '../prototype-data/stories'
import type { Story } from '../types/story'
import { decisionCount, pickEnding, score, validateStory, type Decision } from './story'

const decided = (...fits: boolean[]): Decision[] =>
  fits.map((fitsText, i) => ({ nodeId: `n${i}`, choiceIndex: 0, fitsText }))

describe.each(stories.map(story => [story.id, story] as const))('story %s', (_id, story) => {
  it('is playable and fair', () => {
    expect(validateStory(story)).toEqual([])
  })

  it('gives the best ending only for reading everything well', () => {
    const total = decisionCount(story)
    const best = pickEnding(story, decided(...Array(total).fill(true)))
    const oneMiss = pickEnding(story, decided(false, ...Array(total - 1).fill(true)))
    expect(best.minScore).toBe(total)
    expect(oneMiss.minScore).toBeLessThan(best.minScore)
  })
})

it('Fluisterbos has five decisions', () => {
  expect(decisionCount(stories[0])).toBe(5)
})

describe('pickEnding', () => {
  const story = stories[0]

  it('picks the ending that matches the score', () => {
    expect(pickEnding(story, decided(true, true, true, true, true)).minScore).toBe(5)
    expect(pickEnding(story, decided(true, true, true, false, false)).minScore).toBe(3)
    expect(pickEnding(story, decided(true, false, false, false, false)).minScore).toBe(0)
  })

  it('counts only choices that fit the text', () => {
    expect(score(decided(true, false, true))).toBe(2)
  })
})

describe('validateStory', () => {
  const tiny = (overrides: Partial<Story> = {}): Story => ({
    id: 't',
    title: 't',
    description: '',
    emoji: '',
    category: '',
    time: '',
    available: true,
    startNode: 'a',
    nodes: {
      a: {
        kind: 'decision',
        chapter: '',
        title: '',
        image: '',
        text: 'De sleutel ligt onder de mat.',
        question: 'Waar?',
        choices: [
          { text: 'mat', next: 'end', fitsText: true },
          { text: 'kast', next: 'end', fitsText: false },
        ],
        clue: 'De sleutel ligt onder de mat.',
        structure: 'oorzaak-gevolg',
      },
      end: { kind: 'finale', chapter: '', title: '', image: '', text: '' },
    },
    endings: [
      { minScore: 0, title: '', image: '', text: '' },
      { minScore: 1, title: '', image: '', text: '' },
    ],
    ...overrides,
  })

  it('accepts a correct story', () => {
    expect(validateStory(tiny())).toEqual([])
  })

  it('catches a clue that is not in the text', () => {
    const story = tiny()
    const node = story.nodes.a
    if (node.kind === 'decision') node.clue = 'Iets wat er niet staat.'
    expect(validateStory(story).join()).toContain('aanwijzing')
  })

  it('catches a broken link and two fitting choices', () => {
    const story = tiny()
    const node = story.nodes.a
    if (node.kind === 'decision') {
      node.choices[1] = { text: 'kast', next: 'nergens', fitsText: true }
    }
    const problems = validateStory(story).join(' | ')
    expect(problems).toContain('onbekend deel "nergens"')
    expect(problems).toContain('2 passende keuzes')
  })

  it('catches an ending that can never be reached', () => {
    const story = tiny({ endings: [{ minScore: 0, title: '', image: '', text: '' }, { minScore: 4, title: '', image: '', text: '' }] })
    expect(validateStory(story).join()).toContain('onbereikbaar')
  })
})
