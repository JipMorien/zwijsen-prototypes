import type { WordHelp } from '../types/story'
import type { Random } from './story'

/** The numbers 0..count-1 in a random order that is never the right order already. */
export function shuffledOrder(count: number, random: Random = Math.random): number[] {
  const order = Array.from({ length: count }, (_, index) => index)
  if (count < 2) return order
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
  } while (order.every((value, index) => value === index))
  return order
}

/**
 * For an order puzzle: which places the child got right. `answer` holds item indexes in the order
 * the child put them; item i belongs in place i.
 */
export function correctPlaces(answer: number[]): boolean[] {
  return answer.map((item, place) => item === place)
}

/** A piece of a sentence: plain text, or a difficult word that has an explanation. */
export type TextPiece = { text: string; word?: WordHelp }

/** Splits text so the difficult words can be shown as tappable words. Matches whole words only. */
export function splitWords(text: string, words: WordHelp[]): TextPiece[] {
  const byForm = new Map<string, WordHelp>()
  for (const word of words) for (const form of word.forms) byForm.set(form.toLowerCase(), word)
  if (byForm.size === 0) return [{ text }]

  const forms = [...byForm.keys()].sort((a, b) => b.length - a.length).map(form => form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(?<!\\p{L})(${forms.join('|')})(?!\\p{L})`, 'giu')
  const pieces: TextPiece[] = []
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > last) pieces.push({ text: text.slice(last, start) })
    pieces.push({ text: match[0], word: byForm.get(match[0].toLowerCase()) })
    last = start + match[0].length
  }
  if (last < text.length) pieces.push({ text: text.slice(last) })
  return pieces
}
