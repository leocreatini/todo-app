import React from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps extends RouteComponentProps {
  as: React.FunctionComponent
}

export default function ProtectedRoute({
  as: Route,
  navigate: nav,
  default: boolean,
  path,
  location,
  uri,
  ...props
}: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    console.log('No user, go to login.')
    navigate('/sign-in')
  }
  return <Route {...props} />
}
