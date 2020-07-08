import { Todo } from './types'

export function todosByDate(a: Todo, b: Todo) {
  if (a.createdAt && b.createdAt) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  return 0
}
