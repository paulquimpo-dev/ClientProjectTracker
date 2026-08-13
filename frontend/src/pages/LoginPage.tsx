import { useState, type FormEvent } from 'react'

import { ApiError, signIn } from '../services/authService'
import type { AuthenticatedUser } from '../services/authService'

interface LoginPageProps {
  message?: { text: string; tone: 'info' | 'error' } | null
  onSignedIn: (user: AuthenticatedUser) => void
}

export function LoginPage({ message, onSignedIn }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
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
        <p>Use your account to access client projects.</p>

        {message?.text ? (
          <p className={`login-notice login-notice--${message.tone}`} role="status">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              {message.tone === 'info' ? <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></> : <><circle cx="12" cy="12" r="9" /><path d="M12 8v5m0 3h.01" /></>}
            </svg>
            {message.text}
          </p>
        ) : null}
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
          <div className="password-input">
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-input__toggle"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              disabled={isSubmitting}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              title={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                {isPasswordVisible ? (
                  <><path d="M3 3l18 18" /><path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" /><path d="M9.9 5.1A10.7 10.7 0 0 1 12 5c5.5 0 9 5 9 7s-1.1 2.8-2.8 4.1M6.2 6.2C4.2 7.6 3 9.8 3 12c0 2 3.5 7 9 7 1.1 0 2.1-.2 3-.5" /></>
                ) : (
                  <><path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" /><circle cx="12" cy="12" r="3" /></>
                )}
              </svg>
            </button>
          </div>

          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
