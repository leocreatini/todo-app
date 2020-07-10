import React from 'react'
import { Auth } from 'aws-amplify'
import { navigate } from '@reach/router'

interface AuthContextProps {
  user: UserData
  signIn: (email: string, password: string) => void
  signOut: () => void
}

interface UserData {
  uid: string
  email: string
  isVerified: boolean
}

const AuthContext = React.createContext<AuthContextProps>({
  user: {
    uid: '',
    email: '',
    isVerified: false,
  },
  signIn: () => {},
  signOut: () => {},
})

function createUserData(authData: any): UserData | {} {
  return authData
    ? {
        email: authData.attributes.email,
        isVerified: authData.attributes.email_verified,
        uid: authData.attributes.sub,
      }
    : {}
}

function AuthContextProvider(props: any) {
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = React.useState(false)
  const [user, setUser] = React.useState() as any

  React.useEffect(() => {
    async function getUser() {
      try {
        const authData = await Auth.currentAuthenticatedUser()
        if (authData) {
          setUser(createUserData(authData))
          navigate('/')
        }
        setHasAttemptedSignIn(true)
      } catch (error) {
        if (error === 'not authenticated') {
          console.log(error)
          navigate('/sign-in')
        }
        setHasAttemptedSignIn(true)
      }
    }
    getUser()
  }, [setUser])

  async function signIn(email: string, password: string) {
    try {
      const authData = await Auth.signIn({ username: email, password: password })
      setUser(createUserData(authData))
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  async function signOut() {
    try {
      await Auth.signOut()
      navigate('/sign-in')
    } catch (error) {
      console.log(error)
    }
  }

  // first try to get user data.
  if (!hasAttemptedSignIn) {
    return <p>Loading...</p>
  }
  return <AuthContext.Provider value={{ user, signIn, signOut }} {...props} />
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be a descendent of the AuthContextProvider.')
  }
  return context
}

export { AuthContextProvider, useAuth }
