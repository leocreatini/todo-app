import { Todo } from './types'

export function todosByDate(a: Todo, b: Todo) {
  if (a.createdAt && b.createdAt) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  return 0
}

export function splitByCompleted([com, inc]: Todo[][], t: Todo) {
  return t.isComplete ? [[t, ...com], inc] : [com, [t, ...inc]]
}
