import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

const signInMock = vi.hoisted(() => vi.fn())

vi.mock('../services/authService', () => ({
  ApiError: class ApiError extends Error {},
  signIn: signInMock,
}))

import { LoginPage } from './LoginPage'

test('submits credentials and enters the authenticated application state', async () => {
  signInMock.mockResolvedValue({ id: 1, username: 'project-manager' })
  const onSignedIn = vi.fn()

  render(<LoginPage onSignedIn={onSignedIn} />)
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'project-manager' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'correct-password' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

  await vi.waitFor(() => expect(onSignedIn).toHaveBeenCalledWith({ id: 1, username: 'project-manager' }))
})

test('keeps the password hidden by default and lets the user reveal it', () => {
  render(<LoginPage onSignedIn={vi.fn()} />)

  const password = screen.getByLabelText('Password')
  expect(password).toHaveAttribute('type', 'password')

  fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
  expect(password).toHaveAttribute('type', 'text')
  expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
})
