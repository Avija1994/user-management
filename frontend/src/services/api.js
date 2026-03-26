import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

// Attach token from storage on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fruitables_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fruitables_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
