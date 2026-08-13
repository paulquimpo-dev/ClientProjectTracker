import { useEffect, useState } from 'react'

import './App.css'
import { LoginPage } from './pages/LoginPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ApiError, getSession, signOut } from './services/authService'
import type { AuthenticatedUser } from './services/authService'

type SessionState = 'checking' | 'signed-out' | 'signed-in'

function App() {
  const [sessionState, setSessionState] = useState<SessionState>('checking')
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)

  useEffect(() => {
    void getSession()
      .then((sessionUser) => {
        setUser(sessionUser)
        setSessionState(sessionUser ? 'signed-in' : 'signed-out')
      })
      .catch(() => {
        setSessionMessage('Unable to check your session. Please try signing in again.')
        setSessionState('signed-out')
      })
  }, [])

  useEffect(() => {
    function handleAuthenticationRequired() {
      setUser(null)
      setSessionMessage('Your session has ended. Please sign in again.')
      setSessionState('signed-out')
    }

    window.addEventListener('authentication-required', handleAuthenticationRequired)
    return () => window.removeEventListener('authentication-required', handleAuthenticationRequired)
  }, [])

  async function handleSignOut() {
    try {
      await signOut()
      setUser(null)
      setSessionMessage('You have been signed out.')
      setSessionState('signed-out')
    } catch (error: unknown) {
      setSessionMessage(error instanceof ApiError ? error.message : 'Unable to sign out. Please try again.')
    }
  }

  if (sessionState === 'checking') {
    return <main className="session-state" role="status">Checking your session…</main>
  }

  if (sessionState === 'signed-out' || !user) {
    return <LoginPage message={sessionMessage} onSignedIn={(sessionUser) => {
      setUser(sessionUser)
      setSessionMessage(null)
      setSessionState('signed-in')
    }} />
  }

  return <ProjectsPage user={user} onSignOut={() => void handleSignOut()} />
}

export default App
