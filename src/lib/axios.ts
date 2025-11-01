import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
  // headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access-Token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // call refresh endpoint
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/api/v1/auth/refresh',
        {
          method: 'GET', // ✅ because your backend uses router.get('/refresh')
          credentials: 'include', // ✅ send cookies with the request
        }
      )
      console.log(res)
      const data = await res.json()

      if (data?.access_token) {
        localStorage.setItem('access-token', data.access_token)
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
