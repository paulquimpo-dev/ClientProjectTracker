import { useEffect, useState } from 'react'
import './App.css'
import { ApiError, getProjects } from './services/projectService'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

function App() {
  const [connectionMessage, setConnectionMessage] = useState('Checking project API connection…')

  useEffect(() => {
    getProjects()
      .then((projects) => {
        setConnectionMessage(`Project API connected: ${projects.length} project(s) available.`)
      })
      .catch((error: unknown) => {
        const message = error instanceof ApiError ? error.message : 'Unable to connect to the project service.'
        setConnectionMessage(message)
      })
  }, [])

  return (
    <main className="app-shell">
      <p className="eyebrow">Client Project Tracker</p>
      <h1>Frontend foundation ready</h1>
      <p className="summary">
        React and TypeScript are configured. Project management features will be added in the next phases.
      </p>
      <p className="api-status">
        Configured API: <code>{apiBaseUrl}</code>
      </p>
      <p className="connection-status" role="status">
        {connectionMessage}
      </p>
    </main>
  )
}

export default App
