/** The four text structures Zwijsen wants children to recognise. */
export type TextStructure = 'oorzaak-gevolg' | 'tijdvolgorde' | 'vergelijken' | 'probleem-oplossing'

export type StoryChoice = {
  text: string
  next: string
  /** True for the one choice that matches what the text says. */
  fitsText: boolean
}

type BaseNode = {
  chapter: string
  title: string
  text: string
  image: string
}

/** A moment where the child decides, and only a careful reader knows the wise choice. */
export type DecisionNode = BaseNode & {
  kind: 'decision'
  question: string
  choices: StoryChoice[]
  /** The sentence from `text` that holds the answer. Shown in the recap at the end. */
  clue: string
  structure: TextStructure
}

/** A passage that continues to the next node, e.g. what happens after a choice. */
export type PassageNode = BaseNode & {
  kind: 'passage'
  next: string
}

/** The last passage. After it, the ending is picked from how well the child read. */
export type FinaleNode = BaseNode & {
  kind: 'finale'
}

export type StoryNode = DecisionNode | PassageNode | FinaleNode

export type StoryEnding = {
  /** Lowest number of choices that fit the text needed for this ending. */
  minScore: number
  title: string
  image: string
  text: string
}

export type Story = {
  id: string
  title: string
  description: string
  emoji: string
  category: string
  time: string
  available: boolean
  startNode: string
  nodes: Record<string, StoryNode>
  endings: StoryEnding[]
}
