import type { Story, Trace } from '../types/story'
import { decisionNode, type Decision, type Playthrough } from './story'

/** A sentence the child marked with the highlighter. */
export type Mark = {
  nodeId: string
  chapter: string
  text: string
}

/**
 * Splits a paragraph into sentences. Only splits when the next sentence starts with a capital,
 * so `"Zoek je een kat?" vraagt hij.` stays one sentence.
 */
export function splitSentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?]["”]?)\s+(?=["“]?[A-ZÀ-Ý])/)
    .map(sentence => sentence.trim())
    .filter(Boolean)
}

function normalize(text: string): string {
  return text.replace(/["“”]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * True when one of the marks covers the clue. A clue can be several sentences long, so marking
 * any sentence of it counts, and so does a mark that contains the whole clue.
 */
export function clueMarked(clue: string, marks: Mark[], nodeId: string): boolean {
  const target = normalize(clue)
  const clueSentences = splitSentences(clue).map(normalize)
  return marks.some(mark => {
    if (mark.nodeId !== nodeId) return false
    const marked = normalize(mark.text)
    if (marked.length <= 3) return false
    // The mark is part of the clue, or holds a whole sentence of it (e.g. 'Mama zei: "<clue>').
    return target.includes(marked) || clueSentences.some(sentence => marked.includes(sentence))
  })
}

/** The traces the child has picked up so far, in the order the story lists them. */
export function activeTraces(story: Story, flags: Set<string>): (Trace & { flag: string })[] {
  return Object.entries(story.traces)
    .filter(([flag]) => flags.has(flag))
    .map(([flag, trace]) => ({ flag, ...trace }))
}

/**
 * How late it is, from 0 (morning) to 1 (dark). Time passes with every decision, and a choice
 * that did not fit the text costs extra time. A perfect read ends in the afternoon.
 */
export function duskLevel(decisions: Decision[], total: number): number {
  if (total === 0) return 0
  const misses = decisions.filter(decision => !decision.fitsText).length
  return Math.min(1, (decisions.length / total) * 0.35 + (misses / total) * 0.65)
}

export function timeOfDay(dusk: number): string {
  if (dusk < 0.3) return 'Ochtend'
  if (dusk < 0.55) return 'Middag'
  if (dusk < 0.8) return 'Het wordt al laat'
  return 'Bijna donker'
}

/** How many sentences a child can mark on one page. Every clue can be marked with one. */
export const INK_PER_PAGE = 2

export function inkLeft(marks: Mark[], nodeId: string): number {
  return Math.max(0, INK_PER_PAGE - marks.filter(mark => mark.nodeId === nodeId).length)
}

/** How many marks the child made, and how many of them were (part of) a clue. */
export function markAccuracy(story: Story, playthrough: Playthrough, marks: Mark[]): { marked: number; onClue: number } {
  const onClue = marks.filter(mark => {
    const node = decisionNode(story, mark.nodeId)
    return node ? clueMarked(node.variants[playthrough[mark.nodeId] ?? 0].clue, [mark], mark.nodeId) : false
  }).length
  return { marked: marks.length, onClue }
}
