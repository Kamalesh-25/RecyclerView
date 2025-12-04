import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MoviesPage from './pages/MoviesPage'
import { isAuthenticated, logout } from './auth/auth'

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const navigate = useNavigate()

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [])

  const handleLogout = () => {
    logout()
    setAuthed(false)
    navigate('/login')
  }

  return (
    <div>
      <header className="header">
        <Link to="/" className="brand">TMDB Collections</Link>
        <nav>
          {authed ? (
            <button className="btn small danger" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setAuthed(true)} />} />
        <Route path="/" element={authed ? <MoviesPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
