import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/*
 * AuthContext — global auth state with localStorage persistence.
 * User: { name, email } | null
 * Operations: login, register, logout, forgotPassword, resetPassword
 * Computed: isAuthenticated
 * Demo only — no real security. Passwords are NOT stored.
 */

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'shoply_auth'

function loadAuth() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.user && parsed.token) return parsed
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

function saveAuth(auth) {
  try {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)

  // Persist to localStorage on every change
  useEffect(() => {
    saveAuth(auth)
  }, [auth])

  const login = useCallback((email) => {
    // Demo: validate and store user (no real security)
    const user = { name: email.split('@')[0], email }
    const token = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setAuth({ user, token })
    return { success: true }
  }, [])

  const register = useCallback((name, email) => {
    // Demo: validate and store user (no real security)
    const user = { name, email }
    const token = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setAuth({ user, token })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
  }, [])

  const forgotPassword = useCallback((email) => {
    // Demo: just log, no real email sent
    console.log('Password reset requested for:', email)
    return { success: true }
  }, [])

  const resetPassword = useCallback((token) => {
    // Demo: just log, no real password update
    console.log('Password reset with token:', token)
    return { success: true }
  }, [])

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.user),
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
