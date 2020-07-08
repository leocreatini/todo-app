import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api'
import { RouteComponentProps } from '@reach/router'
import FlipMove from 'react-flip-move'

import {
  ListTodosQuery,
  CreateTodoMutation,
  UpdateTodoMutation,
  DeleteTodoMutation,
} from '../../API'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries'
import { useAuth } from '../../context/AuthContext'
import { Todo } from './types'
import { todosByDate } from './helpers'
import './style.scss'

interface TodosProps extends RouteComponentProps {}

const initialState: Todo = { name: '', description: '', isComplete: false }

function Todos(props: TodosProps) {
  const { logout } = useAuth()
  const [todo, setTodo] = React.useState(initialState)
  const [todos, setTodos] = React.useState([] as Todo[])

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setTodo({ ...todo, [event.target.name]: event.target.value })
  }

  async function fetchTodos() {
    const result = (await API.graphql(graphqlOperation(queries.listTodos))) as GraphQLResult<
      ListTodosQuery
    >
    if (result.data?.listTodos?.items) {
      let todos: Todo[] = []
      result.data.listTodos.items.forEach((item: Todo | null) => {
        if (item) {
          todos.push(item)
        }
      })
      todos.sort(todosByDate)
      setTodos(todos)
    }
  }

  async function addTodo(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    if (todo.name.length > 0) {
      const result = (await API.graphql(
        graphqlOperation(mutations.createTodo, { input: todo })
      )) as GraphQLResult<CreateTodoMutation>

      if (result.data?.createTodo) {
        const newTodo = result.data.createTodo
        setTodo(initialState)
        setTodos((todos) => [newTodo, ...todos])
      }
    }
  }

  function toggleComplete(todo: Todo) {
    return async function toggleTodoComplete() {
      try {
        const updatedTodo = { id: todo.id, isComplete: !todo.isComplete }
        const result = (await API.graphql(
          graphqlOperation(mutations.updateTodo, { input: updatedTodo })
        )) as GraphQLResult<UpdateTodoMutation>

        if (result.data?.updateTodo) {
          const updated = result.data?.updateTodo
          const updatedTodos = todos.map((t: Todo) => {
            return t.id === updated.id ? updated : t
          }) as Todo[]
          setTodos(updatedTodos)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  function deleteTodo(todo: Todo) {
    return async function () {
      try {
        const result = (await API.graphql(
          graphqlOperation(mutations.deleteTodo, { input: { id: todo.id } })
        )) as GraphQLResult<DeleteTodoMutation>

        if (result.data?.deleteTodo) {
          const updatedTodos = todos.filter((t) => t.id !== todo.id) as Todo[]
          setTodos(updatedTodos)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  function handleKeyPress(todo: Todo) {
    return (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          toggleComplete(todo)()
          break
        case 'Delete':
        case 'Backspace':
          deleteTodo(todo)()
          break
        default:
          return
      }
    }
  }

  // init
  React.useEffect(() => {
    fetchTodos()
  }, [])

  const sortedTodos: Todo[] = todos.sort((a, b) => (a.isComplete && !b.isComplete ? 1 : -1))

  return (
    <section className="todo-app">
      <nav className="todo__nav">
        <button className="inline-button" onClick={logout}>
          Logout
        </button>
      </nav>

      <section>
        <h1 className="todo__title">Yet Another Todo App</h1>
        <form className="todo__form" onSubmit={addTodo}>
          <div className="todo__form-input-group">
            <input
              className="todo__form-textfield"
              type="text"
              name="name"
              onChange={updateField}
              value={todo.name}
              autoFocus
              autoComplete="off"
              placeholder="Read next chapter of..."
            />
            <button className="todo__form-button" type="submit">
              +
            </button>
          </div>
        </form>
      </section>
      {todos.length > 0 && (
        <p className="microcopy">
          Click a todo to mark complete. Keyboard-enabled: tab to cycle through, space/enter to
          toggle complete, delete/backspace to remove todo.
        </p>
      )}
      <ul className="todo__list">
        <FlipMove>
          {sortedTodos.map((todo: Todo) => (
            <li key={todo.id} className="todo__item">
              <button
                className={todo.isComplete ? 'todo__item-button completed' : 'todo__item-button'}
                onClick={toggleComplete(todo)}
                onKeyUp={handleKeyPress(todo)}
                title="Mark completed or undo"
              >
                {todo.name}
              </button>
              <button
                className="todo__item-delete"
                onClick={deleteTodo(todo)}
                tabIndex={-1}
                title="Delete todo"
              >
                &times;
              </button>
            </li>
          ))}
        </FlipMove>
      </ul>
      <footer className="todo__footer">
        Made by{' '}
        <a
          className="inline-button"
          href="https://leocreatini.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leo Creatini
        </a>{' '}
        with Typescript, React, GraphQL, and AWS. 2020.
      </footer>
    </section>
  )
}

export default Todos
