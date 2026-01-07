import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
    
    // Listen for logout events (from API interceptor)
    const handleLogout = () => {
      setUser(null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe()
      setUser(response.data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    setUser(response.data.user)
    return response.data
  }

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password })
    setUser(response.data.user)
    return response.data
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  const updateProfile = async (data) => {
    const response = await authAPI.updateProfile(data)
    setUser(response.data.user)
    return response.data
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

