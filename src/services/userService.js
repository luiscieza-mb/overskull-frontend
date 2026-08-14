import api from '@/services/api'

export default {
  list() {
    return api.get('/users')
  },
  create(payload) {
    return api.post('/users', payload)
  },
  update(id, payload) {
    return api.put(`/users/${id}`, payload)
  },
  remove(id) {
    return api.delete(`/users/${id}`)
  },
}
