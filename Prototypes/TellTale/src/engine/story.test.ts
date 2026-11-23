import { describe, expect, it } from 'vitest'
import { stories } from '../prototype-data/stories'
import type { Story } from '../types/story'
import { loadProgress, recordRead } from './progress'
import {
  collectFlags,
  createPlaythrough,
  decisionCount,
  fittingChoice,
  nextAfterChoice,
  pickEnding,
  renderText,
  score,
  storyVars,
  validateStory,
  type Decision,
  type Playthrough,
} from './story'

const decided = (...fits: boolean[]): Decision[] =>
  fits.map((fitsText, i) => ({ nodeId: `n${i}`, choiceIndex: 0, fitsText }))

/** Every combination of variants a story can be played with. */
function allPlaythroughs(story: Story): Playthrough[] {
  let combos: Playthrough[] = [{}]
  for (const [id, node] of Object.entries(story.nodes)) {
    if (node.kind !== 'decision') continue
    combos = combos.flatMap(combo => node.variants.map((_, index) => ({ ...combo, [id]: index })))
  }
  return combos
}

describe.each(stories.map(story => [story.id, story] as const))('story %s', (_id, story) => {
  it('is playable and fair', () => {
    expect(validateStory(story)).toEqual([])
  })

  it('gives the best ending only for reading everything well', () => {
    const total = decisionCount(story)
    expect(pickEnding(story, decided(...Array(total).fill(true))).minScore).toBe(total)
    expect(pickEnding(story, decided(false, ...Array(total - 1).fill(true))).minScore).toBeLessThan(total)
  })

  it('leaves no {markers} or [[markers]] in any text, for any variant and any path', () => {
    const allFlags = new Set(['omweg', 'scheur', 'natteSchoen', 'brug', 'vos'])
    for (const playthrough of allPlaythroughs(story)) {
      const vars = storyVars(story, playthrough)
      const texts = [...Object.values(story.nodes).map(n => n.text), ...story.endings.map(e => e.text)]
      for (const text of texts) {
        for (const flags of [new Set<string>(), allFlags]) {
          expect(renderText(text, vars, flags)).not.toMatch(/\{\w+\}|\[\[|\]\]/)
        }
      }
    }
  })
})

describe('Fluisterbos', () => {
  const story = stories[0]

  it('has five decisions', () => {
    expect(decisionCount(story)).toBe(5)
  })

  it('makes every choice of the first decision the right one in some variant', () => {
    const start = story.nodes.start
    if (start.kind !== 'decision') throw new Error('start should be a decision')
    expect(new Set(start.variants.map(v => v.fits))).toEqual(new Set([0, 1, 2]))
  })

  it('sends a fitting choice on and a wrong choice to its miss passage', () => {
    const playthrough: Playthrough = { start: 0 } // Pluis likes fish: the stream (choice 1) fits
    expect(fittingChoice(story, 'start', playthrough)).toBe(1)
    expect(nextAfterChoice(story, 'start', 1, playthrough)).toBe('spoor')
    expect(nextAfterChoice(story, 'start', 0, playthrough)).toBe('molenMis')
  })
})

describe('createPlaythrough', () => {
  const story = stories[0]

  it('picks a different variant than last time for every decision', () => {
    let previous = createPlaythrough(story, () => 0)
    for (let i = 0; i < 20; i++) {
      const next = createPlaythrough(story, Math.random, previous)
      for (const id of Object.keys(previous)) expect(next[id]).not.toBe(previous[id])
      previous = next
    }
  })
})

describe('renderText', () => {
  const vars = { plek: 'de beek' }

  it('fills in variables', () => {
    expect(renderText('Mila loopt naar {plek}.', vars, new Set())).toBe('Mila loopt naar de beek.')
  })

  it('shows traces only when their flag is set', () => {
    const text = 'Begin.\n\n[[natteSchoen: Haar schoen soppt.]]\n\n[[!natteSchoen: Haar schoenen zijn droog.]]\n\nEinde.'
    expect(renderText(text, vars, new Set(['natteSchoen']))).toBe('Begin.\n\nHaar schoen soppt.\n\nEinde.')
    expect(renderText(text, vars, new Set())).toBe('Begin.\n\nHaar schoenen zijn droog.\n\nEinde.')
  })

  it('collects flags from the passages read', () => {
    expect([...collectFlags(stories[0], ['start', 'molenMis', 'spoor', 'rechtdoorMis'])].sort()).toEqual([
      'natteSchoen',
      'omweg',
    ])
  })
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

describe('progress', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
  }

  it('keeps the best score and remembers the secret ending', () => {
    const storage = memory()
    recordRead('s', { score: 2, total: 5, secretEnding: false }, storage)
    recordRead('s', { score: 5, total: 5, secretEnding: true }, storage)
    const progress = recordRead('s', { score: 3, total: 5, secretEnding: false }, storage)
    expect(progress).toEqual({ bestScore: 5, lastScore: 3, total: 5, timesRead: 3, secretEndingFound: true })
    expect(loadProgress('s', storage)).toEqual(progress)
  })

  it('works without storage', () => {
    expect(recordRead('s', { score: 1, total: 5, secretEnding: false }, undefined).timesRead).toBe(1)
    expect(loadProgress('s', undefined)).toBeUndefined()
  })
})

describe('validateStory', () => {
  const tiny = (): Story => ({
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
        text: 'De sleutel ligt {waar}.',
        question: 'Waar?',
        choices: [
          { text: 'mat', miss: 'mis' },
          { text: 'kast', miss: 'mis' },
        ],
        variants: [
          { fits: 0, clue: 'De sleutel ligt onder de mat.', vars: { waar: 'onder de mat' } },
          { fits: 1, clue: 'De sleutel ligt in de kast.', vars: { waar: 'in de kast' } },
        ],
        onFit: 'end',
        structure: 'oorzaak-gevolg',
      },
      mis: { kind: 'passage', chapter: '', title: '', image: '', text: 'Mis.', next: 'end', sets: ['fout'] },
      end: { kind: 'finale', chapter: '', title: '', image: '', text: '[[fout: Jammer.]]' },
    },
    endings: [
      { minScore: 0, title: '', image: '', text: '' },
      { minScore: 1, title: '', image: '', text: '' },
    ],
  })
  const decision = (story: Story) => {
    const node = story.nodes.a
    if (node.kind !== 'decision') throw new Error('a should be a decision')
    return node
  }

  it('accepts a correct story', () => {
    expect(validateStory(tiny())).toEqual([])
  })

  it('catches a clue that is not in the text of its variant', () => {
    const story = tiny()
    decision(story).variants[1].clue = 'De sleutel ligt onder de mat.'
    expect(validateStory(story).join()).toContain('variant 2: de aanwijzing')
  })

  it('catches variants with different variables', () => {
    const story = tiny()
    decision(story).variants[1].vars = { ergens: 'in de kast' }
    expect(validateStory(story).join()).toContain('andere variabelen')
  })

  it('catches unknown variables and flags', () => {
    const story = tiny()
    story.nodes.end.text = '{onbekend} [[nooitGezet: x]]'
    const problems = validateStory(story).join(' | ')
    expect(problems).toContain('{onbekend}')
    expect(problems).toContain('"nooitGezet"')
  })

  it('catches a wrong-able choice without a miss passage, and a broken link', () => {
    const story = tiny()
    decision(story).choices[0] = { text: 'mat' }
    decision(story).onFit = 'nergens'
    const problems = validateStory(story).join(' | ')
    expect(problems).toContain('keuze 1 kan fout zijn')
    expect(problems).toContain('onbekend deel "nergens"')
  })
})
