import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(localStorage.getItem('fruitables_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => {
          localStorage.removeItem('fruitables_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (emailOrObj, password) => {
    const credentials = typeof emailOrObj === 'object' ? emailOrObj : { email: emailOrObj, password }
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('fruitables_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    localStorage.removeItem('fruitables_token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  const register = async (nameOrObj, email, password, password_confirmation) => {
    const payload = typeof nameOrObj === 'object' ? nameOrObj : { name: nameOrObj, email, password, password_confirmation }
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('fruitables_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
// This is custom hook to use the AuthContext and access auth state and functions in components. 
// Instead of writing this line every time we want to use the context, 
// we can just call useAuth() in our components to get access to the auth state and functions. This keeps our code cleaner and more concise.
export const useAuth = () => useContext(AuthContext)
