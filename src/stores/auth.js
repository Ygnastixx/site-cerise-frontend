import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(matricule, password) {
      const response = await api.post('/token/', { matricule, password })

      this.token = response.data.access
      this.refreshToken = response.data.refresh

      localStorage.setItem('access_token', this.token)
      localStorage.setItem('refresh_token', this.refreshToken)
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
  },
})
