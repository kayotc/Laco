'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem('laco_access_token', accessToken)
    localStorage.setItem('laco_refresh_token', refreshToken)
  }

  const clearTokens = () => {
    localStorage.removeItem('laco_access_token')
    localStorage.removeItem('laco_refresh_token')
  }

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('laco_access_token')
    if (!token) { setLoading(false); return }
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const register = async (dados) => {
    const res = await api.post('/auth/register', dados)
    saveTokens(res.data.accessToken, res.data.refreshToken)
    setUser(res.data.user)
    return res.data
  }

  const login = async (email, senha) => {
    const res = await api.post('/auth/login', { email, senha })
    saveTokens(res.data.accessToken, res.data.refreshToken)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('laco_refresh_token')
    try { await api.post('/auth/logout', { refreshToken }) } catch {}
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
