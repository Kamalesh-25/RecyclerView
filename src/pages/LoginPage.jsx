import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/auth'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      login(username, password)
      onLogin && onLogin()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="center-screen">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Sign in (demo)</h2>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">Login</button>
        <p className="muted">(Demo login — any non-empty username & password will work.)</p>
      </form>
    </div>
  )
}
