import api from '@/services/api'

export default {
  login(payload) {
    return api.post('/login', payload)
  },
  logout() {
    return api.post('/logout')
  },
  me() {
    return api.get('/me')
  },
}
