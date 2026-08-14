<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useCategoryStore } from '@/stores/categories'
import { validateCategoryForm } from '@/utils/validators'

const categoryStore = useCategoryStore()

const editingId = ref(null)
const submitting = ref(false)
const clientErrors = ref({})
const serverErrors = ref({})
const categoryToDelete = ref(null)

const form = reactive({
  name: '',
  description: '',
})

onMounted(() => {
  categoryStore.fetchAll()
})

function fieldError(field) {
  return clientErrors.value[field] ?? serverErrors.value[field]?.[0] ?? null
}

function resetForm() {
  editingId.value = null
  form.name = ''
  form.description = ''
  clientErrors.value = {}
  serverErrors.value = {}
}

function editCategory(category) {
  editingId.value = category.id
  form.name = category.name
  form.description = category.description ?? ''
  clientErrors.value = {}
  serverErrors.value = {}
}

async function handleSubmit() {
  clientErrors.value = validateCategoryForm(form)
  if (Object.keys(clientErrors.value).length) return

  submitting.value = true
  serverErrors.value = {}

  const payload = { name: form.name, description: form.description || null }

  try {
    if (editingId.value) {
      await categoryStore.update(editingId.value, payload)
    } else {
      await categoryStore.create(payload)
    }
    resetForm()
  } catch (err) {
    serverErrors.value = err.errors ?? {}
  } finally {
    submitting.value = false
  }
}

function askDelete(category) {
  categoryToDelete.value = category
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  await categoryStore.remove(categoryToDelete.value.id).catch(() => {})
  categoryToDelete.value = null
}
</script>

<template>
  <AppLayout>
    <h2 class="mb-6 text-2xl font-bold text-slate-900">Categorías</h2>

    <div class="grid gap-6 lg:grid-cols-3">
      <form
        class="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <h3 class="font-semibold text-slate-900">
          {{ editingId ? 'Editar categoría' : 'Nueva categoría' }}
        </h3>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="cat-name">Nombre</label>
          <input
            id="cat-name"
            v-model="form.name"
            type="text"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('name') }"
          />
          <p v-if="fieldError('name')" class="mt-1 text-sm text-red-600">{{ fieldError('name') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="cat-description">Descripción</label>
          <textarea
            id="cat-description"
            v-model="form.description"
            rows="3"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            :disabled="submitting"
          >
            <LoadingSpinner v-if="submitting" size="sm" />
            {{ editingId ? 'Guardar cambios' : 'Crear categoría' }}
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
        <LoadingSpinner v-if="categoryStore.loading" size="lg" class="py-12" />

        <div v-else-if="!categoryStore.items.length" class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No hay categorías registradas todavía.
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="category in categoryStore.items"
            :key="category.id"
            class="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p class="font-medium text-slate-900">{{ category.name }}</p>
              <p class="text-sm text-slate-500">{{ category.description }}</p>
              <p class="mt-1 text-xs text-slate-400">{{ category.products_count }} producto(s)</p>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <button type="button" class="text-indigo-600 hover:underline" @click="editCategory(category)">
                Editar
              </button>
              <button type="button" class="text-red-600 hover:underline" @click="askDelete(category)">
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <ConfirmModal
      :open="Boolean(categoryToDelete)"
      :title="`Eliminar ${categoryToDelete?.name ?? ''}`"
      message="Los productos asociados también se eliminarán."
      @confirm="confirmDelete"
      @cancel="categoryToDelete = null"
    />
  </AppLayout>
</template>
