import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { AUTH_TOKEN_KEY } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => Boolean(state.user?.is_admin),
  },
  actions: {
    async login(credentials) {
      const { data } = await authService.login(credentials)
      this.token = data.data.token
      this.user = data.data.user
      localStorage.setItem(AUTH_TOKEN_KEY, this.token)
      return this.user
    },

    async logout() {
      try {
        await authService.logout()
      } catch {
        // El token puede ya estar inválido; igual limpiamos la sesión local.
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    },

    async hydrate() {
      if (!this.token) return

      try {
        const { data } = await authService.me()
        this.user = data.data
      } catch {
        this.token = null
        this.user = null
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    },
  },
})
