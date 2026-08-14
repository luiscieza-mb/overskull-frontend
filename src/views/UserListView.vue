<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useUserStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import { validateUserForm } from '@/utils/validators'

const userStore = useUserStore()
const authStore = useAuthStore()

const editingId = ref(null)
const submitting = ref(false)
const clientErrors = ref({})
const serverErrors = ref({})
const userToDelete = ref(null)

const form = reactive({
  name: '',
  username: '',
  password: '',
  is_admin: false,
})

onMounted(() => {
  userStore.fetchAll()
})

function fieldError(field) {
  return clientErrors.value[field] ?? serverErrors.value[field]?.[0] ?? null
}

function resetForm() {
  editingId.value = null
  form.name = ''
  form.username = ''
  form.password = ''
  form.is_admin = false
  clientErrors.value = {}
  serverErrors.value = {}
}

function editUser(user) {
  editingId.value = user.id
  form.name = user.name
  form.username = user.username
  form.password = ''
  form.is_admin = user.is_admin
  clientErrors.value = {}
  serverErrors.value = {}
}

async function handleSubmit() {
  clientErrors.value = validateUserForm(form, { isEdit: Boolean(editingId.value) })
  if (Object.keys(clientErrors.value).length) return

  submitting.value = true
  serverErrors.value = {}

  try {
    if (editingId.value) {
      const payload = { name: form.name, username: form.username, is_admin: form.is_admin }
      if (form.password) payload.password = form.password
      await userStore.update(editingId.value, payload)
    } else {
      await userStore.create({
        name: form.name,
        username: form.username,
        password: form.password,
        is_admin: form.is_admin,
      })
    }
    resetForm()
  } catch (err) {
    serverErrors.value = err.errors ?? {}
  } finally {
    submitting.value = false
  }
}

function askDelete(user) {
  userToDelete.value = user
}

async function confirmDelete() {
  if (!userToDelete.value) return
  await userStore.remove(userToDelete.value.id).catch(() => {})
  userToDelete.value = null
}
</script>

<template>
  <AppLayout>
    <h2 class="mb-6 text-2xl font-bold text-slate-900">Usuarios</h2>

    <div class="grid gap-6 lg:grid-cols-3">
      <form
        class="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <h3 class="font-semibold text-slate-900">
          {{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}
        </h3>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="user-name">Nombre</label>
          <input
            id="user-name"
            v-model="form.name"
            type="text"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('name') }"
          />
          <p v-if="fieldError('name')" class="mt-1 text-sm text-red-600">{{ fieldError('name') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="user-username">Usuario</label>
          <input
            id="user-username"
            v-model="form.username"
            type="text"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('username') }"
          />
          <p v-if="fieldError('username')" class="mt-1 text-sm text-red-600">{{ fieldError('username') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="user-password">
            Contraseña
            <span v-if="editingId" class="font-normal text-slate-400">(dejar en blanco para no cambiar)</span>
          </label>
          <input
            id="user-password"
            v-model="form.password"
            type="password"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('password') }"
          />
          <p v-if="fieldError('password')" class="mt-1 text-sm text-red-600">{{ fieldError('password') }}</p>
        </div>

        <div class="flex items-center gap-2">
          <input id="user-is-admin" v-model="form.is_admin" type="checkbox" class="rounded border-slate-300" />
          <label class="text-sm text-slate-700" for="user-is-admin">Administrador</label>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            :disabled="submitting"
          >
            <LoadingSpinner v-if="submitting" size="sm" />
            {{ editingId ? 'Guardar cambios' : 'Crear usuario' }}
          </button>
          <button
            v-if="editingId"
            type="button"
            class="text-sm font-medium text-slate-600 hover:underline"
            @click="resetForm"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div class="lg:col-span-2">
        <LoadingSpinner v-if="userStore.loading" size="lg" class="py-12" />

        <div v-else-if="!userStore.items.length" class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No hay usuarios registrados todavía.
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="user in userStore.items"
            :key="user.id"
            class="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p class="font-medium text-slate-900">
                {{ user.name }}
                <span v-if="user.is_admin" class="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  Administrador
                </span>
              </p>
              <p class="text-sm text-slate-500">@{{ user.username }}</p>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <button type="button" class="text-indigo-600 hover:underline" @click="editUser(user)">
                Editar
              </button>
              <button
                v-if="user.id !== authStore.user?.id"
                type="button"
                class="text-red-600 hover:underline"
                @click="askDelete(user)"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <ConfirmModal
      :open="Boolean(userToDelete)"
      :title="`Eliminar ${userToDelete?.name ?? ''}`"
      message="Esta acción no se puede deshacer."
      @confirm="confirmDelete"
      @cancel="userToDelete = null"
    />
  </AppLayout>
</template>
