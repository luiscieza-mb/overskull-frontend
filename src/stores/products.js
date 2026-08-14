import { defineStore } from 'pinia'
import productService from '@/services/productService'
import { useNotificationStore } from '@/stores/notifications'

export const useProductStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id) => state.items.find((product) => product.id === Number(id)),
  },
  actions: {
    async fetchAll(params = {}) {
      this.loading = true
      this.error = null

      try {
        const { data } = await productService.list(params)
        this.items = data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.loading = true
      this.error = null

      try {
        const { data } = await productService.create(payload)
        this.items.unshift(data.data)
        useNotificationStore().success(data.message)
        return data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async update(id, payload) {
      this.loading = true
      this.error = null

      try {
        const { data } = await productService.update(id, payload)
        const index = this.items.findIndex((product) => product.id === id)
        if (index !== -1) this.items[index] = data.data
        useNotificationStore().success(data.message)
        return data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async remove(id) {
      this.loading = true
      this.error = null

      try {
        const { data } = await productService.remove(id)
        this.items = this.items.filter((product) => product.id !== id)
        useNotificationStore().success(data.message)
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
