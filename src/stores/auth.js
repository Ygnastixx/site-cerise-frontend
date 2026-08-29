import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    role: localStorage.getItem('role') || null,
    matricule: localStorage.getItem('matricule') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'ADMIN',
    isStaffOrAdmin: (state) => state.role === 'STAFF' || state.role === 'ADMIN',
  },

  actions: {
    async login(matricule, password) {
      const response = await api.post('/token/', { matricule, password })

      this.token = response.data.access
      this.refreshToken = response.data.refresh
      this.role = response.data.role
      this.matricule = response.data.matricule

      localStorage.setItem('access_token', this.token)
      localStorage.setItem('refresh_token', this.refreshToken)
      localStorage.setItem('role', this.role)
      localStorage.setItem('matricule', this.matricule)
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.role = null
      this.matricule = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('role')
      localStorage.removeItem('matricule')
    },
  },
})
