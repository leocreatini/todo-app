import React from 'react'
import { render } from '@testing-library/react'
import Todos from './containers/Todos'

test('renders learn react link', () => {
  const { getByText } = render(<Todos />)
  const linkElement = getByText(/Logout/i)
  expect(linkElement).toBeInTheDocument()
})
