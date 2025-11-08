import axios from 'axios'
import { supabase } from '../lib/supabaseClient.ts'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
})

// Request interceptor to attach token
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access-token')

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Refresh token via Supabase
      const { data } = await supabase.auth.refreshSession()
      const newToken = data.session?.access_token

      if (newToken) {
        localStorage.setItem('access-token', newToken)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
