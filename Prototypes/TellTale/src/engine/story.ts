import type { DecisionNode, Story, StoryEnding, StoryNode } from '../types/story'

export type Decision = {
  nodeId: string
  choiceIndex: number
  fitsText: boolean
}

/** Which variant of each decision is used in this playthrough, by decision node id. */
export type Playthrough = Record<string, number>

export type Random = () => number

const PLACEHOLDER = /\{(\w+)\}/g
const CONDITIONAL = /\[\[(!?)(\w+):\s*([^\]]*)\]\]/g

function decisionEntries(story: Story): [string, DecisionNode][] {
  return Object.entries(story.nodes).filter((entry): entry is [string, DecisionNode] => entry[1].kind === 'decision')
}

/**
 * Picks a variant for every decision. When a previous playthrough is given, each decision gets a
 * different variant than last time where possible, so a reread can't be done from memory.
 */
export function createPlaythrough(story: Story, random: Random = Math.random, previous?: Playthrough): Playthrough {
  const playthrough: Playthrough = {}
  for (const [id, node] of decisionEntries(story)) {
    const options = node.variants.map((_, index) => index).filter(index => index !== previous?.[id])
    const pool = options.length > 0 ? options : [0]
    playthrough[id] = pool[Math.floor(random() * pool.length)]
  }
  return playthrough
}

/** What the reader is called in the story when they did not give their name. */
export const READER_DEFAULT = 'speurder'

/**
 * The values for {key} markers: the reader's {naam} and the vars of the variants in this playthrough.
 */
export function storyVars(story: Story, playthrough: Playthrough, reader = READER_DEFAULT): Record<string, string> {
  const vars: Record<string, string> = { naam: reader }
  for (const [id, node] of decisionEntries(story)) {
    Object.assign(vars, node.variants[playthrough[id] ?? 0].vars)
  }
  return vars
}

export function fittingChoice(story: Story, nodeId: string, playthrough: Playthrough): number {
  const node = decisionNode(story, nodeId)
  if (!node) return -1
  return node.variants[playthrough[nodeId] ?? 0].fits
}

/** Where the story goes after a choice: on to the next part, or to the passage where something goes wrong. */
export function nextAfterChoice(story: Story, nodeId: string, choiceIndex: number, playthrough: Playthrough): string | undefined {
  const node = decisionNode(story, nodeId)
  if (!node) return undefined
  return choiceIndex === fittingChoice(story, nodeId, playthrough) ? node.onFit : node.choices[choiceIndex]?.miss
}

/** Flags set by the passages the child has read so far. */
export function collectFlags(story: Story, visited: string[]): Set<string> {
  const flags = new Set<string>()
  for (const id of visited) {
    const node = story.nodes[id]
    if (node && node.kind !== 'decision') node.sets?.forEach(flag => flags.add(flag))
  }
  return flags
}

export function renderText(text: string, vars: Record<string, string>, flags: Set<string>): string {
  return text
    .replace(CONDITIONAL, (_, not: string, flag: string, content: string) =>
      (not === '!') !== flags.has(flag) ? content : '',
    )
    .replace(PLACEHOLDER, (match, key: string) => vars[key] ?? match)
    .replace(/ {2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function score(decisions: Decision[]): number {
  return decisions.filter(decision => decision.fitsText).length
}

/** The best ending the child's score reaches. */
export function pickEnding(story: Story, decisions: Decision[]): StoryEnding {
  const points = score(decisions)
  const reachable = story.endings.filter(ending => ending.minScore <= points)
  return reachable.reduce((best, ending) => (ending.minScore > best.minScore ? ending : best))
}

export function bestScore(story: Story): number {
  return Math.max(...story.endings.map(ending => ending.minScore))
}

/** Every path through the story passes the same number of decisions; validateStory checks this. */
export function decisionCount(story: Story): number {
  let count = 0
  let id: string | undefined = story.startNode
  const seen = new Set<string>()
  while (id && !seen.has(id)) {
    seen.add(id)
    const node: Story['nodes'][string] | undefined = story.nodes[id]
    if (!node) break
    if (node.kind === 'decision') {
      count += 1
      id = node.onFit
    } else if (node.kind === 'passage' || node.kind === 'puzzle') {
      id = node.next
    } else {
      id = undefined
    }
  }
  return count
}

export function decisionNode(story: Story, nodeId: string): DecisionNode | undefined {
  const node = story.nodes[nodeId]
  return node?.kind === 'decision' ? node : undefined
}

/** Every text a child can see: titles, story texts, puzzle items and endings. */
export function textsOf(story: Story): string[] {
  return [
    ...Object.values(story.nodes).flatMap(node => [node.title, node.text, ...puzzleTexts(node)]),
    ...story.endings.flatMap(ending => [ending.title, ending.text]),
  ]
}

function puzzleTexts(node: StoryNode): string[] {
  if (node.kind !== 'puzzle') return []
  const { puzzle } = node
  return puzzle.type === 'order'
    ? [puzzle.prompt, ...puzzle.items]
    : [puzzle.prompt, ...puzzle.pairs.flatMap(pair => [pair.left, pair.right])]
}

/** Returns a list of problems; an empty list means the story is playable and fair. */
export function validateStory(story: Story): string[] {
  const problems: string[] = []
  if (!story.nodes[story.startNode]) problems.push(`startNode "${story.startNode}" bestaat niet`)

  // Variables: same keys in every variant of a decision, no key defined by two decisions.
  const definedBy = new Map<string, string>()
  for (const [id, node] of decisionEntries(story)) {
    if (node.variants.length === 0) {
      problems.push(`${id} heeft geen varianten`)
      continue
    }
    const keys = Object.keys(node.variants[0].vars).sort().join(',')
    node.variants.forEach((variant, index) => {
      if (Object.keys(variant.vars).sort().join(',') !== keys) {
        problems.push(`${id} variant ${index + 1} heeft andere variabelen dan variant 1`)
      }
    })
    for (const key of Object.keys(node.variants[0].vars)) {
      if (definedBy.has(key)) problems.push(`variabele {${key}} staat in ${definedBy.get(key)} én ${id}`)
      definedBy.set(key, id)
    }
  }
  const baseVars = storyVars(story, {})
  const flagsSet = new Set(
    Object.values(story.nodes).flatMap(node => (node.kind === 'decision' ? [] : (node.sets ?? []))),
  )
  for (const flag of flagsSet) {
    if (!story.traces[flag]) problems.push(`vlag "${flag}" heeft geen spoor in traces`)
  }
  for (const flag of Object.keys(story.traces)) {
    if (!flagsSet.has(flag)) problems.push(`spoor "${flag}" wordt nergens gezet`)
  }
  for (const text of textsOf(story)) {
    for (const [, key] of text.matchAll(PLACEHOLDER)) {
      if (!(key in baseVars)) problems.push(`variabele {${key}} wordt gebruikt maar nergens gedefinieerd`)
    }
    for (const [, , flag] of text.matchAll(CONDITIONAL)) {
      if (!flagsSet.has(flag)) problems.push(`vlag "${flag}" wordt gebruikt maar nergens gezet`)
    }
  }

  // Decisions: valid variants, clue really in the text, a miss passage for every choice that can be wrong.
  for (const [id, node] of decisionEntries(story)) {
    if (node.choices.length < 2) problems.push(`${id} heeft minder dan 2 keuzes`)
    node.variants.forEach((variant, index) => {
      if (!node.choices[variant.fits]) problems.push(`${id} variant ${index + 1} wijst naar een keuze die niet bestaat`)
      const rendered = renderText(node.text, { ...baseVars, ...variant.vars }, new Set())
      if (!rendered.includes(variant.clue)) {
        problems.push(`${id} variant ${index + 1}: de aanwijzing staat niet letterlijk in de tekst`)
      }
      // Scan-proof: the text names every choice, so matching one word to a button gives nothing away.
      for (const choice of node.choices) {
        if (!rendered.toLowerCase().includes(choice.keyword.toLowerCase())) {
          problems.push(`${id} variant ${index + 1}: keuze "${choice.text}" (${choice.keyword}) wordt niet genoemd in de tekst`)
        }
      }
    })
    node.choices.forEach((choice, index) => {
      const canBeWrong = node.variants.some(variant => variant.fits !== index)
      if (canBeWrong && !choice.miss) problems.push(`${id} keuze ${index + 1} kan fout zijn maar heeft geen miss-passage`)
    })
  }

  // Word help: every word appears somewhere, and is not explained twice.
  const variantTexts = decisionEntries(story).flatMap(([, node]) => node.variants.flatMap(variant => Object.values(variant.vars)))
  const allText = [...textsOf(story), ...variantTexts].join(' ').toLowerCase()
  const seenForms = new Set<string>()
  for (const word of story.words) {
    if (!word.forms.some(form => allText.includes(form.toLowerCase()))) {
      problems.push(`woord "${word.forms[0]}" staat nergens in het verhaal`)
    }
    for (const form of word.forms) {
      if (seenForms.has(form.toLowerCase())) problems.push(`woord "${form}" wordt twee keer uitgelegd`)
      seenForms.add(form.toLowerCase())
    }
  }

  // Puzzles: enough items, and no two the same, so there is exactly one right answer.
  for (const [id, node] of Object.entries(story.nodes)) {
    if (node.kind !== 'puzzle') continue
    const { puzzle } = node
    const items = puzzle.type === 'order' ? puzzle.items : puzzle.pairs.map(pair => pair.right)
    if (items.length < 3) problems.push(`${id}: een puzzel heeft minstens 3 onderdelen nodig`)
    if (new Set(items).size !== items.length) problems.push(`${id}: twee onderdelen van de puzzel zijn hetzelfde`)
  }

  // Links: every target exists.
  for (const [id, node] of Object.entries(story.nodes)) {
    const targets =
      node.kind === 'decision'
        ? [node.onFit, ...node.choices.flatMap(choice => (choice.miss ? [choice.miss] : []))]
        : node.kind === 'passage' || node.kind === 'puzzle'
          ? [node.next]
          : []
    for (const target of targets) {
      if (!story.nodes[target]) problems.push(`${id} verwijst naar onbekend deel "${target}"`)
    }
  }

  // Paths: each ends in a finale, without loops, after the same number of decisions.
  const decisionsPerPath = new Set<number>()
  const reached = new Set<string>()
  const walk = (id: string, decisions: number, path: string[]) => {
    const node = story.nodes[id]
    if (!node) return
    if (path.includes(id)) {
      problems.push(`lus in het verhaal: ${[...path, id].join(' → ')}`)
      return
    }
    reached.add(id)
    const nextPath = [...path, id]
    if (node.kind === 'decision') {
      walk(node.onFit, decisions + 1, nextPath)
      node.choices.forEach(choice => choice.miss && walk(choice.miss, decisions + 1, nextPath))
    } else if (node.kind === 'passage' || node.kind === 'puzzle') walk(node.next, decisions, nextPath)
    else decisionsPerPath.add(decisions)
  }
  walk(story.startNode, 0, [])

  if (decisionsPerPath.size > 1) {
    problems.push(`paden hebben een verschillend aantal keuzes: ${[...decisionsPerPath].join(', ')}`)
  }
  for (const id of Object.keys(story.nodes)) {
    if (!reached.has(id)) problems.push(`${id} is nergens vandaan te bereiken`)
  }

  const scores = new Set(story.endings.map(ending => ending.minScore))
  if (!scores.has(0)) problems.push('er is geen einde voor score 0')
  if (scores.size !== story.endings.length) problems.push('twee eindes hebben dezelfde minScore')
  if (story.endings.some(ending => ending.minScore > Math.max(...decisionsPerPath))) {
    problems.push('een einde is onbereikbaar')
  }

  return problems
}
