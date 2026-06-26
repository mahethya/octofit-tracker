import './App.css'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">OctoFit Tracker</p>
        <h1>Modern fitness tracking for ambitious teams</h1>
        <p className="lead">
          Log workouts, build teams, and chase your next milestone from a single place.
        </p>
        <div className="actions">
          <a className="primary-btn" href={`${apiBaseUrl}/api/health`}>
            Check API health
          </a>
          <a className="secondary-btn" href="https://vite.dev/guide/">
            Vite docs
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
