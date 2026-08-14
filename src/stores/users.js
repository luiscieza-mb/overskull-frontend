import { defineStore } from 'pinia'
import userService from '@/services/userService'
import { useNotificationStore } from '@/stores/notifications'

export const useUserStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null

      try {
        const { data } = await userService.list()
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
        const { data } = await userService.create(payload)
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
        const { data } = await userService.update(id, payload)
        const index = this.items.findIndex((user) => user.id === id)
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
        const { data } = await userService.remove(id)
        this.items = this.items.filter((user) => user.id !== id)
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
