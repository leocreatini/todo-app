import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { InputGroup, Button, Intent } from '@blueprintjs/core'
import { Link } from '@reach/router'

import AuthCard from '../../components/AuthCard'
import './style.scss'

interface ResetPasswordFormProps extends RouteComponentProps {}

const initialUserInputs = { email: '', requestSent: false }

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
  const [userInputs, setUserInputs] = React.useState(initialUserInputs)

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setUserInputs({ ...userInputs, [event.target.name]: event.target.value })
  }
  function submitForm(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    setUserInputs({ ...userInputs, requestSent: true })
  }
  return (
    <AuthCard>
      <form className="auth-form" onSubmit={submitForm}>
        <h2>Reset Password</h2>
        {userInputs.requestSent ? (
          <div>
            <p>Please check your email for further instructions to reset your password.</p>
            <p>
              If you haven't received one in your inbox, first check spam folder or we can try{' '}
              <a href="#resend">resending a new email</a>.
            </p>
          </div>
        ) : (
          <>
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
            <section className="action-bar">
              <Button
                className="auth-form__button"
                type="submit"
                large
                intent={Intent.PRIMARY}
                icon="log-in"
                disabled={userInputs.email.length < 3}
              >
                Request Password Reset
              </Button>
              <div className="auth-form__secondary-actions">
                <Link className="auth-form__link" to="/">
                  Nevermind, let's go back
                </Link>
              </div>
            </section>
          </>
        )}
      </form>
    </AuthCard>
  )
}
