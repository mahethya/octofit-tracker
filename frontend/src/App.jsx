import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <section className="hero-panel">
          <p className="eyebrow">OctoFit Tracker</p>
          <h1>Modern fitness tracking for ambitious teams</h1>
          <p className="lead">
            Log workouts, build teams, and chase your next milestone from a single place.
          </p>
          <nav className="actions">
            <NavLink className="primary-btn" to="/users">Users</NavLink>
            <NavLink className="secondary-btn" to="/teams">Teams</NavLink>
            <NavLink className="secondary-btn" to="/activities">Activities</NavLink>
            <NavLink className="secondary-btn" to="/leaderboard">Leaderboard</NavLink>
            <NavLink className="secondary-btn" to="/workouts">Workouts</NavLink>
          </nav>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Users />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  )
}

export default App
