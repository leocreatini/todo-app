import React from 'react'
import { Auth } from 'aws-amplify'
import { Link, RouteComponentProps, navigate } from '@reach/router'
import { InputGroup, Button, Intent } from '@blueprintjs/core'

import AuthCard from '../../components/AuthCard'
import './style.scss'

interface SignUpFormProps extends RouteComponentProps {
  location: any
}

const initialUserInputs = { email: '', confirmationCode: '' }

export default function ConfirmSignUpForm(props: SignUpFormProps) {
  const [userInputs, setUserInputs] = React.useState(initialUserInputs)

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setUserInputs({ ...userInputs, [event.target.name]: event.target.value })
  }

  React.useEffect(() => {
    if (props.location?.state?.email) {
      setUserInputs((data) => ({ ...data, email: props.location.state.email }))
    }
  }, [props.location])

  async function confirmSignUp(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { email, confirmationCode } = userInputs
      await Auth.confirmSignUp(email, confirmationCode)
      navigate('/', { state: email })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthCard>
      <form className="auth-form" onSubmit={confirmSignUp}>
        <h2>Confirm Sign Up</h2>
        <div className="auth-form__field">
          <label>
            <span className="auth-form__label">Confirmation Code</span>
            <InputGroup
              className="auth-form__textfield"
              type="text"
              name="confirmationCode"
              value={userInputs.confirmationCode}
              onChange={updateField}
              placeholder="######"
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
            disabled={userInputs.confirmationCode.length === 0}
          >
            Finish
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
