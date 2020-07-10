import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { InputGroup, Button, Intent } from '@blueprintjs/core'
import { Link } from '@reach/router'

import AuthCard from '../../components/AuthCard'
import { useAuth } from '../../context/AuthContext'
import './style.scss'
import { InlineButton } from '../../components/InlineButton'

const TEST_EMAIL = 'test@testing.com'
const TEST_PASS = 'Testing1!'

interface SignInProps extends RouteComponentProps {
  location: any
}

const initialUserInputs = { email: '', password: '', remember: 'unchecked' }

export default function SignIn(props: SignInProps) {
  const { signIn } = useAuth()
  const [userInputs, setUserInputs] = React.useState(initialUserInputs)

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setUserInputs({ ...userInputs, [event.target.name]: event.target.value })
  }

  function handleSignIn(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    signIn(userInputs.email, userInputs.password)
  }

  function useTestAccount() {
    signIn(TEST_EMAIL, TEST_PASS)
  }

  React.useEffect(() => {
    if (props.location?.state?.email) {
      setUserInputs((data) => ({ ...data, email: props.location.state.email }))
    }
  }, [props.location])

  return (
    <AuthCard>
      <form className="auth-form" onSubmit={handleSignIn}>
        <h2>Sign In</h2>
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
          <InlineButton title="Use public test account instead" onClick={useTestAccount} />
        </div>
        <section className="action-bar">
          <Button
            className="auth-form__button"
            type="submit"
            large
            intent={Intent.PRIMARY}
            icon="log-in"
            disabled={userInputs.email.length === 0 || userInputs.password.length === 0}
          >
            Sign In
          </Button>
          <div className="auth-form__secondary-actions">
            <Link className="auth-form__link" to="/sign-up">
              Not a member? Sign up
            </Link>
            <Link className="auth-form__link" to="/reset-password">
              I can't remember my password
            </Link>
          </div>
        </section>
      </form>
    </AuthCard>
  )
}
