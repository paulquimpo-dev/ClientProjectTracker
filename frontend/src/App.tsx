import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

function App() {
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
    </main>
  )
}

export default App
