import { useEffect, useState } from 'react'

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/activities`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setActivities(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) return <p>Loading activities...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <section>
      <h2>Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id || activity.type}>
            {activity.type} — {activity.notes}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Activities
