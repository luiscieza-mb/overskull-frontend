<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { validateLoginForm } from '@/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const clientErrors = ref({})
const formError = ref(null)

const form = reactive({
  username: '',
  password: '',
})

function fieldError(field) {
  return clientErrors.value[field] ?? null
}

async function handleSubmit() {
  clientErrors.value = validateLoginForm(form)
  if (Object.keys(clientErrors.value).length) return

  submitting.value = true
  formError.value = null

  try {
    await authStore.login(form)
    router.push({ name: 'dashboard' })
  } catch (err) {
    formError.value = err.message ?? 'No se pudo iniciar sesión.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <form
      class="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="mb-2 text-center">
        <h1 class="text-lg font-bold text-slate-900">Overskull · Gestión de Productos</h1>
        <p class="mt-1 text-sm text-slate-500">Inicia sesión para continuar</p>
      </div>

      <p v-if="formError" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{{ formError }}</p>

      <div>
        <label class="block text-sm font-medium text-slate-700" for="login-username">Usuario</label>
        <input
          id="login-username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-400': fieldError('username') }"
        />
        <p v-if="fieldError('username')" class="mt-1 text-sm text-red-600">{{ fieldError('username') }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700" for="login-password">Contraseña</label>
        <input
          id="login-password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-400': fieldError('password') }"
        />
        <p v-if="fieldError('password')" class="mt-1 text-sm text-red-600">{{ fieldError('password') }}</p>
      </div>

      <button
        type="submit"
        class="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        :disabled="submitting"
      >
        <LoadingSpinner v-if="submitting" size="sm" />
        Iniciar sesión
      </button>
    </form>
  </div>
</template>
