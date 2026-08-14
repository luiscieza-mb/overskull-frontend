import { defineStore } from 'pinia'
import categoryService from '@/services/categoryService'
import { useNotificationStore } from '@/stores/notifications'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id) => state.items.find((category) => category.id === Number(id)),
  },
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null

      try {
        const { data } = await categoryService.list()
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
        const { data } = await categoryService.create(payload)
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
        const { data } = await categoryService.update(id, payload)
        const index = this.items.findIndex((category) => category.id === id)
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
        const { data } = await categoryService.remove(id)
        this.items = this.items.filter((category) => category.id !== id)
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
