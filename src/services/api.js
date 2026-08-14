import axios from 'axios'
import { useNotificationStore } from '@/stores/notifications'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Normaliza cualquier error de red o HTTP al mismo formato que usa el backend
 * ({ success: false, message, errors }) y muestra un toast global.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notifications = useNotificationStore()

    let normalized = {
      success: false,
      message: 'Ha ocurrido un error inesperado. Intenta nuevamente.',
      errors: {},
    }

    if (error.response) {
      const { status, data } = error.response

      normalized = {
        success: false,
        message: data?.message ?? `Error ${status}: no se pudo completar la solicitud.`,
        errors: data?.errors ?? {},
        status,
      }
    } else if (error.request) {
      normalized.message = 'No se pudo conectar con el servidor. Verifica tu conexión.'
    }

    notifications.error(normalized.message)

    return Promise.reject(normalized)
  },
)

export default api
