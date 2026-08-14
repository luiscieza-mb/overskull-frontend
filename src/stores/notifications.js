import { defineStore } from 'pinia'

let nextId = 1

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    toasts: [],
  }),
  actions: {
    push({ type = 'info', message, timeout = 4000 }) {
      const id = nextId++
      this.toasts.push({ id, type, message })

      if (timeout) {
        setTimeout(() => this.remove(id), timeout)
      }

      return id
    },
    success(message, timeout) {
      return this.push({ type: 'success', message, timeout })
    },
    error(message, timeout) {
      return this.push({ type: 'error', message, timeout })
    },
    remove(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },
  },
})
