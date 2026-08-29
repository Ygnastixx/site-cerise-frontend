import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur : ajoute le token JWT à chaque requête outbound
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepte les réponses pour gérer l'expiration du token (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')

      if (refreshToken) {
        try {
          // Demande un nouveau token d'accès via l'endpoint de refresh
          const { data } = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken,
          })

          localStorage.setItem('access_token', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest) // Relance la requête initiale
        } catch (refreshError) {
          // Le refresh token est également expiré : déconnexion
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          router.push('/login')
          return Promise.reject(refreshError)
        }
      } else {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
