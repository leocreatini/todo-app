import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'

import { AuthContextProvider } from './context/AuthContext'
import SignInForm from './containers/SignInForm'
import SignUpForm from './containers/SignUpForm'
import ConfirmSignUpForm from './containers/ConfirmSignUpForm'
import ResetPasswordForm from './containers/ResetPasswordForm'
import Todos from './containers/Todos'

import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

const TodosRoute = (props: RouteComponentProps) => <Todos path={props.path} />
const SignInFormRoute = (props: RouteComponentProps) => (
  <SignInForm path={props.path} location={props.location} />
)
const SignUpFormRoute = (props: RouteComponentProps) => <SignUpForm path={props.path} />
const ConfirmSignUpFormRoute = (props: RouteComponentProps) => (
  <ConfirmSignUpForm path={props.path} location={props.location} />
)
const ResetPasswordFormRoute = (props: RouteComponentProps) => (
  <ResetPasswordForm path={props.path} />
)

function App() {
  return (
    <div className="app-background">
      <AuthContextProvider>
        <Router>
          <ProtectedRoute as={TodosRoute} path="/" />
          <SignInFormRoute path="/sign-in" />
          <SignUpFormRoute path="/sign-up" />
          <ConfirmSignUpFormRoute path="/confirm-sign-up" />
          <ResetPasswordFormRoute path="/reset-password" />
        </Router>
      </AuthContextProvider>
    </div>
  )
}

export default App
