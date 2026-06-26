import { useEffect, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/leaderboard`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setEntries(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) return <p>Loading leaderboard...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <section>
      <h2>Leaderboard</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry._id || entry.name}>
            {entry.rank}. {entry.name} — {entry.score}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Leaderboard
