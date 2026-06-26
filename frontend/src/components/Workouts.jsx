import { useEffect, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/workouts`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setWorkouts(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  if (loading) return <p>Loading workouts...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <section>
      <h2>Workouts</h2>
      <ul>
        {workouts.map((workout) => (
          <li key={workout._id || workout.title}>
            {workout.title} — {workout.focus}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Workouts
