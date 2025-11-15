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
    // If there's no response or it's not a 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    // Avoid retry loops
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    interface QueueItem {
      resolve: (value?: unknown) => void
      reject: (err?: unknown) => void
    }

    // keep shared state on the axios instance (typed locally)
    const apiAny = api as unknown as {
      _isRefreshing?: boolean
      _failedQueue?: QueueItem[]
    }
    if (typeof apiAny._isRefreshing !== 'boolean') apiAny._isRefreshing = false
    if (!Array.isArray(apiAny._failedQueue)) apiAny._failedQueue = []

    const processQueue = (err: unknown, token: string | null) => {
      apiAny._failedQueue!.forEach((prom) => {
        if (err) {
          prom.reject(err)
        } else {
          prom.resolve(token)
        }
      })
      apiAny._failedQueue = []
    }

    if (apiAny._isRefreshing) {
      // push to queue and wait
      return new Promise((resolve, reject) => {
        apiAny._failedQueue!.push({
          resolve: (value?: unknown) => {
            const token = typeof value === 'string' ? value : undefined
            if (token && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    apiAny._isRefreshing = true

    try {
      const { data, error: refreshError } = await supabase.auth.refreshSession()

      const newToken = data?.session?.access_token

      if (refreshError || !newToken) {
        // Refresh failed: clear queue and sign out the user client-side.
        processQueue(
          refreshError || new Error('Unable to refresh access token'),
          null
        )
        try {
          await supabase.auth.signOut()
        } catch {
          // ignore signOut errors
        }
        return Promise.reject(
          refreshError || new Error('Unable to refresh access token')
        )
      }

      // Save new token and retry original request + queued requests
      localStorage.setItem('access-token', newToken)
      if (originalRequest.headers)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

      processQueue(null, newToken)

      return api(originalRequest)
    } catch (err: unknown) {
      processQueue(err, null)
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore signOut errors
      }
      return Promise.reject(err)
    } finally {
      apiAny._isRefreshing = false
    }
  }
)

export default api
