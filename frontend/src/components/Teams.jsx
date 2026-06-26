import { useEffect, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/teams`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setTeams(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (loading) return <p>Loading teams...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <section>
      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team._id || team.name}>
            {team.name} — {team.sport}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Teams
