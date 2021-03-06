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
import { InlineButtonLink } from '../../components/InlineButton'
import { todosByDate, splitByCompleted } from './helpers'
import { Todo } from './types'
import './style.scss'

interface TodosProps extends RouteComponentProps {}

const initialState: Todo = { name: '', author: '', isComplete: false }

function Todos(props: TodosProps) {
  const { user, signOut } = useAuth()
  const [todo, setTodo] = React.useState(initialState)
  const [todos, setTodos] = React.useState([] as Todo[])

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setTodo({ ...todo, [event.target.name]: event.target.value })
  }

  async function fetchTodos() {
    const result = (await API.graphql(
      graphqlOperation(queries.listTodos, {
        filter: {
          author: {
            eq: user.uid,
          },
        },
        // authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })
    )) as GraphQLResult<ListTodosQuery>
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
    if (todo.name.length > 0 && user && user) {
      const result = (await API.graphql(
        graphqlOperation(mutations.createTodo, { input: { ...todo, author: user.uid } })
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [incompleted, completed] = todos.reduce(splitByCompleted, [[], []])
  const allTodos = [...incompleted.sort(todosByDate), ...completed.sort(todosByDate)]

  return (
    <section className="todo-app">
      <nav className="todo__nav">
        <button className="inline-button" onClick={signOut}>
          Log Out
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
          {allTodos.map((t) => (
            <li key={t.id} className="todo__item">
              <button
                className={t.isComplete ? 'todo__item-button completed' : 'todo__item-button'}
                onClick={toggleComplete(t)}
                onKeyUp={handleKeyPress(t)}
                title="Mark completed or undo"
              >
                {t.name}
              </button>
              <button
                className="todo__item-delete"
                onClick={deleteTodo(t)}
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
        <p>
          Made by <InlineButtonLink title="Leo Creatini" href="https://leocreatini.com" /> with
          Typescript, React, GraphQL, and AWS. 2020.
        </p>
        <p>
          View code on{' '}
          <InlineButtonLink title="GitHub" href="https://github.com/leocreatini/todo-app" />.
        </p>
      </footer>
    </section>
  )
}

export default Todos
