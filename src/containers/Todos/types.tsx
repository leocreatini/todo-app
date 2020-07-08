export interface Todo {
  id?: string
  name: string
  description: string | null
  isComplete: boolean | null
  createdAt?: string
  updatedAt?: string
}
