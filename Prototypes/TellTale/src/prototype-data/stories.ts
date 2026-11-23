import type { Story } from '../types/story'
import { fluisterbos } from './fluisterbos'


export const stories: Story[] = [
  fluisterbos
]

export function getStoryById(id: string): Story | undefined {
  return stories.find(story => story.id === id)
}