import { useEffect, useState } from 'react'
import './App.css'

type HealthStatus = {
  status: string
  service: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json() as Promise<HealthStatus>
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main className="app">
      <h1>Job Recruitment &amp; Applicant Tracking System</h1>
      <p>Frontend is up. Backend connectivity check:</p>

      {error && <p className="status status-down">Backend unreachable — {error}</p>}
      {!error && !health && <p className="status status-pending">Checking backend…</p>}
      {health && (
        <p className="status status-up">
          {health.service}: {health.status}
        </p>
      )}
    </main>
  )
}

export default App
