import React from 'react'
import { Auth } from 'aws-amplify'
import { navigate } from '@reach/router'

interface AuthContextProps {
  user: Object
  logout: () => void
}

interface UserData {
  uid: string
  email: string
  isVerified: boolean
}

const AuthContext = React.createContext<Partial<AuthContextProps>>({})

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
        setHasAttemptedSignIn(true)
      }
    }
    getUser()
  }, [setUser])

  async function logout() {
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
  return <AuthContext.Provider value={{ user, logout }} {...props} />
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be a descendent of the AuthContextProvider.')
  }
  return context
}

export { AuthContextProvider, useAuth }
