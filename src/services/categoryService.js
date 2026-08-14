import api from '@/services/api'

export default {
  list() {
    return api.get('/categories')
  },
  get(id) {
    return api.get(`/categories/${id}`)
  },
  create(payload) {
    return api.post('/categories', payload)
  },
  update(id, payload) {
    return api.put(`/categories/${id}`, payload)
  },
  remove(id) {
    return api.delete(`/categories/${id}`)
  },
}
