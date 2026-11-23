import type { DecisionNode, Story, StoryEnding } from '../types/story'

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

export function storyVars(story: Story, playthrough: Playthrough): Record<string, string> {
  const vars: Record<string, string> = {}
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
    } else if (node.kind === 'passage') {
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

function textsOf(story: Story): string[] {
  return [
    ...Object.values(story.nodes).flatMap(node => [node.title, node.text]),
    ...story.endings.flatMap(ending => [ending.title, ending.text]),
  ]
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
    })
    node.choices.forEach((choice, index) => {
      const canBeWrong = node.variants.some(variant => variant.fits !== index)
      if (canBeWrong && !choice.miss) problems.push(`${id} keuze ${index + 1} kan fout zijn maar heeft geen miss-passage`)
    })
  }

  // Links: every target exists.
  for (const [id, node] of Object.entries(story.nodes)) {
    const targets =
      node.kind === 'decision'
        ? [node.onFit, ...node.choices.flatMap(choice => (choice.miss ? [choice.miss] : []))]
        : node.kind === 'passage'
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
    } else if (node.kind === 'passage') walk(node.next, decisions, nextPath)
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
