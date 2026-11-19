// Preview session. Milestone 2 replaces this with POST /api/auth/login (bcrypt + JWT
// issued by the Express backend) — the component API (login/logout/useSession) stays.
import { createContext, useContext, useState, createElement } from 'react'
import { users, DEMO_PASSWORD } from '../data/fixtures'

const KEY = 'attendx.preview.session'
const SessionContext = createContext(null)

export const homeFor = (role) => ({ ADMIN: '/admin', TEACHER: '/teacher', STUDENT: '/student' })[role] || '/login'

export function SessionProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
  })

  async function login(email, password) {
    await new Promise((r) => setTimeout(r, 450))
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!found || password !== DEMO_PASSWORD) throw new Error('Invalid email or password.')
    sessionStorage.setItem(KEY, JSON.stringify(found))
    setUser(found)
    return found
  }

  function logout() {
    sessionStorage.removeItem(KEY)
    setUser(null)
  }

  return createElement(SessionContext.Provider, { value: { user, login, logout } }, children)
}

export const useSession = () => useContext(SessionContext)
