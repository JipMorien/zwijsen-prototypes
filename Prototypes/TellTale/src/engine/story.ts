import type { DecisionNode, Story, StoryEnding } from '../types/story'

export type Decision = {
  nodeId: string
  choiceIndex: number
  fitsText: boolean
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

/** Every path through the story passes the same number of decisions; validateStory checks this. */
export function decisionCount(story: Story): number {
  let count = 0
  let id: string | undefined = story.startNode
  const seen = new Set<string>()
  while (id && !seen.has(id)) {
    seen.add(id)
    const node: Story['nodes'][string] = story.nodes[id]
    if (!node) break
    if (node.kind === 'decision') {
      count += 1
      id = node.choices.find(choice => choice.fitsText)?.next
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

/** Returns a list of problems; an empty list means the story is playable and fair. */
export function validateStory(story: Story): string[] {
  const problems: string[] = []
  const ids = Object.keys(story.nodes)
  if (!story.nodes[story.startNode]) problems.push(`startNode "${story.startNode}" bestaat niet`)

  for (const [id, node] of Object.entries(story.nodes)) {
    const targets =
      node.kind === 'decision' ? node.choices.map(choice => choice.next) : node.kind === 'passage' ? [node.next] : []
    for (const target of targets) {
      if (!story.nodes[target]) problems.push(`${id} verwijst naar onbekend deel "${target}"`)
    }
    if (node.kind === 'decision') {
      const fitting = node.choices.filter(choice => choice.fitsText).length
      if (fitting !== 1) problems.push(`${id} heeft ${fitting} passende keuzes in plaats van 1`)
      if (node.choices.length < 2) problems.push(`${id} heeft minder dan 2 keuzes`)
      if (!node.text.includes(node.clue)) problems.push(`${id}: de aanwijzing staat niet letterlijk in de tekst`)
    }
  }

  // Walk every path: each must end in a finale, without loops, after the same number of decisions.
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
    if (node.kind === 'decision') node.choices.forEach(choice => walk(choice.next, decisions + 1, nextPath))
    else if (node.kind === 'passage') walk(node.next, decisions, nextPath)
    else decisionsPerPath.add(decisions)
  }
  walk(story.startNode, 0, [])

  if (decisionsPerPath.size > 1) {
    problems.push(`paden hebben een verschillend aantal keuzes: ${[...decisionsPerPath].join(', ')}`)
  }
  for (const id of ids) {
    if (!reached.has(id)) problems.push(`${id} is nergens vandaan te bereiken`)
  }

  const scores = new Set(story.endings.map(ending => ending.minScore))
  if (!scores.has(0)) problems.push('er is geen einde voor score 0')
  if (scores.size !== story.endings.length) problems.push('twee eindes hebben dezelfde minScore')
  const maxScore = Math.max(...decisionsPerPath)
  if (story.endings.some(ending => ending.minScore > maxScore)) problems.push('een einde is onbereikbaar')

  return problems
}
