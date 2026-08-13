import { useState, type FormEvent } from 'react'

import { ApiError, signIn } from '../services/authService'
import type { AuthenticatedUser } from '../services/authService'

interface LoginPageProps {
  message?: string | null
  onSignedIn: (user: AuthenticatedUser) => void
}

export function LoginPage({ message, onSignedIn }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }

    setIsSubmitting(true)
    try {
      onSignedIn(await signIn(username, password))
    } catch (authError: unknown) {
      setError(authError instanceof ApiError ? authError.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <img className="brand-logo brand-logo--login" src="/branding/client-project-tracker-logo.png" alt="Client Project Tracker" />
        <h1 id="login-title">Sign in</h1>
        <p>Use your project-manager account to access client projects.</p>

        {message ? <p className="form-error" role="status">{message}</p> : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <form className="login-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={isSubmitting}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />

          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
