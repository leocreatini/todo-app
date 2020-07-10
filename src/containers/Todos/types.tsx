export interface Todo {
  id?: string
  name: string
  author: string
  isComplete: boolean | null
  createdAt?: string
  updatedAt?: string
}
