import React from 'react'
import { Card, Elevation } from '@blueprintjs/core'

interface AuthCardProps {
  children: any
}

export default function AuthCard(props: AuthCardProps) {
  return (
    <div className="auth-app">
      <h1>Yet Another Todo App</h1>
      <Card elevation={Elevation.TWO} className="auth-card">
        {props.children}
      </Card>
    </div>
  )
}
