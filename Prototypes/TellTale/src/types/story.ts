
export type StoryChoice = {
  text: string
  next: string
}

export type StoryNode = {
  chapter: string
  title: string
  text: string
  image: string
  question?: string
  choices?: StoryChoice[]
  ending?: boolean
  reflection?: string
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
}
