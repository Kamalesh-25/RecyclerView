const TOKEN_KEY = 'tmdb_demo_token'

// Demo login: accepts any non-empty username/password
export function login(username, password) {
  if (!username || !password) throw new Error('Username and password required')
  const token = btoa(`${username}:${Date.now()}`)
  localStorage.setItem(TOKEN_KEY, token)
  return token
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}
