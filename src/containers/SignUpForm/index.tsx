import React from 'react'
import { Auth } from 'aws-amplify'
import { Link, RouteComponentProps, navigate } from '@reach/router'
import { InputGroup, Button, Intent } from '@blueprintjs/core'

import './style.scss'
import AuthCard from '../../components/AuthCard'

interface SignUpFormProps extends RouteComponentProps {}

const initialUserInputs = { email: '', password: '', passwordTest: '' }

export default function SignUpForm(props: SignUpFormProps) {
  const [userInputs, setUserInputs] = React.useState(initialUserInputs)

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setUserInputs({ ...userInputs, [event.target.name]: event.target.value })
  }

  async function signUp(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { email, password } = userInputs
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      })
      navigate('/confirm-sign-up', { state: { email } })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthCard>
      <form className="auth-form" onSubmit={signUp}>
        <h2>Sign Up</h2>
        <div className="auth-form__field">
          <label>
            <span className="auth-form__label">Email</span>
            <InputGroup
              className="auth-form__textfield"
              type="email"
              name="email"
              value={userInputs.email}
              onChange={updateField}
              placeholder="username@mail.com"
              leftIcon="person"
              large
            />
          </label>
        </div>
        <div className="auth-form__field">
          <label>
            <span className="auth-form__label">Password</span>
            <InputGroup
              className="auth-form__textfield"
              type="password"
              name="password"
              value={userInputs.password}
              onChange={updateField}
              placeholder="******"
              leftIcon="key"
              large
            />
          </label>
        </div>
        <div className="auth-form__field">
          <label>
            <span className="auth-form__label">Re-enter Password</span>
            <InputGroup
              className="auth-form__textfield"
              type="password"
              name="passwordTest"
              value={userInputs.passwordTest}
              onChange={updateField}
              placeholder="******"
              leftIcon="key"
              large
            />
          </label>
        </div>
        <section className="action-bar">
          <Button
            className="auth-form__button"
            type="submit"
            large
            intent={Intent.PRIMARY}
            icon="person"
            disabled={
              userInputs.email.length === 0 ||
              userInputs.password.length === 0 ||
              userInputs.password !== userInputs.passwordTest
            }
          >
            Sign Up
          </Button>
          <div className="auth-form__secondary-actions">
            <Link className="auth-form__link" to="/">
              Nevermind, let's go back
            </Link>
          </div>
        </section>
      </form>
    </AuthCard>
  )
}
