import { describe, expect, it } from 'vitest'
import { stories } from '../prototype-data/stories'
import { activeTraces, clueMarked, duskLevel, splitSentences, type Mark } from './reading'
import { renderText, storyVars, type Decision } from './story'

const mark = (text: string, nodeId = 'n'): Mark => ({ nodeId, chapter: '', text })

describe('splitSentences', () => {
  it('splits on full stops, question and exclamation marks', () => {
    expect(splitSentences('Mila loopt. Waar is Pluis? Daar!')).toEqual(['Mila loopt.', 'Waar is Pluis?', 'Daar!'])
  })

  it('keeps a quote with the words that follow it', () => {
    expect(splitSentences('"Zoek je een kat?" vraagt hij. "Ik zag hem."')).toEqual([
      '"Zoek je een kat?" vraagt hij.',
      '"Ik zag hem."',
    ])
  })
})

describe('clueMarked', () => {
  const clue = 'Pluis is dol op vis. Misschien is hij naar de beek gelopen.'

  it('counts any sentence of a longer clue, without the quotes around it', () => {
    expect(clueMarked(clue, [mark('"Pluis is dol op vis.')], 'n')).toBe(true)
    expect(clueMarked(clue, [mark('Misschien is hij naar de beek gelopen."')], 'n')).toBe(true)
  })

  it('counts a sentence that holds part of the clue after an introduction', () => {
    expect(clueMarked(clue, [mark('Mama zei vanochtend nog: "Pluis is dol op vis.')], 'n')).toBe(true)
  })

  it('does not count other sentences or marks in another part of the story', () => {
    expect(clueMarked(clue, [mark('Mila loopt het bos in.')], 'n')).toBe(false)
    expect(clueMarked(clue, [mark('Pluis is dol op vis.', 'ander')], 'n')).toBe(false)
  })
})

describe.each(stories.map(story => [story.id, story] as const))('story %s', (_id, story) => {
  it('lets every clue be marked by tapping its sentences', () => {
    const vars = storyVars(story, {})
    for (const [id, node] of Object.entries(story.nodes)) {
      if (node.kind !== 'decision') continue
      node.variants.forEach(variant => {
        const text = renderText(node.text, { ...vars, ...variant.vars }, new Set())
        const sentences = text.split(/\n{2,}/).flatMap(splitSentences)
        const hits = sentences.filter(sentence => clueMarked(variant.clue, [mark(sentence, id)], id))
        expect(hits.length, `${id}: ${variant.clue}`).toBeGreaterThan(0)
      })
    }
  })

  it('shows a trace for every flag', () => {
    const all = new Set(Object.keys(story.traces))
    expect(activeTraces(story, all)).toHaveLength(all.size)
  })
})

describe('duskLevel', () => {
  const decided = (...fits: boolean[]): Decision[] => fits.map(fitsText => ({ nodeId: 'n', choiceIndex: 0, fitsText }))

  it('ends in the afternoon after a perfect read and in the dark after missing everything', () => {
    expect(duskLevel(decided(true, true, true, true, true), 5)).toBeCloseTo(0.35)
    expect(duskLevel(decided(false, false, false, false, false), 5)).toBe(1)
    expect(duskLevel([], 5)).toBe(0)
  })
})
