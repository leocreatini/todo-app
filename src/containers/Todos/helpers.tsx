import { Todo } from './types'

export function todosByDate(a: Todo, b: Todo) {
  if (a.createdAt && b.createdAt) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  return 0
}

export function splitByCompleted([inc, com]: Todo[][], t: Todo) {
  return t.isComplete ? [inc, [t, ...com]] : [[t, ...inc], com]
}
