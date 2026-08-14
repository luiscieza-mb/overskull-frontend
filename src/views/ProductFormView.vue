<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import { validateProductForm } from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const isEditing = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const clientErrors = ref({})
const serverErrors = ref({})

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
})

onMounted(async () => {
  if (!categoryStore.items.length) {
    await categoryStore.fetchAll()
  }

  if (isEditing.value) {
    let product = productStore.byId(route.params.id)

    if (!product) {
      await productStore.fetchAll()
      product = productStore.byId(route.params.id)
    }

    if (product) {
      form.name = product.name
      form.description = product.description ?? ''
      form.price = product.price
      form.stock = product.stock
      form.category_id = product.category_id
    }
  }
})

function fieldError(field) {
  return clientErrors.value[field] ?? serverErrors.value[field]?.[0] ?? null
}

async function handleSubmit() {
  clientErrors.value = validateProductForm(form)
  if (Object.keys(clientErrors.value).length) return

  submitting.value = true
  serverErrors.value = {}

  const payload = {
    name: form.name,
    description: form.description || null,
    price: Number(form.price),
    stock: Number(form.stock),
    category_id: Number(form.category_id),
  }

  try {
    if (isEditing.value) {
      await productStore.update(Number(route.params.id), payload)
    } else {
      await productStore.create(payload)
    }
    router.push('/products')
  } catch (err) {
    serverErrors.value = err.errors ?? {}
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AppLayout>
    <h2 class="mb-6 text-2xl font-bold text-slate-900">
      {{ isEditing ? 'Editar producto' : 'Nuevo producto' }}
    </h2>

    <form
      class="max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-slate-700" for="name">Nombre</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-400': fieldError('name') }"
        />
        <p v-if="fieldError('name')" class="mt-1 text-sm text-red-600">{{ fieldError('name') }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700" for="description">Descripción</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700" for="price">Precio</label>
          <input
            id="price"
            v-model="form.price"
            type="number"
            step="0.01"
            min="0"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('price') }"
          />
          <p v-if="fieldError('price')" class="mt-1 text-sm text-red-600">{{ fieldError('price') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="stock">Stock</label>
          <input
            id="stock"
            v-model="form.stock"
            type="number"
            min="0"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-400': fieldError('stock') }"
          />
          <p v-if="fieldError('stock')" class="mt-1 text-sm text-red-600">{{ fieldError('stock') }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700" for="category_id">Categoría</label>
        <select
          id="category_id"
          v-model="form.category_id"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-400': fieldError('category_id') }"
        >
          <option value="" disabled>Selecciona una categoría</option>
          <option v-for="category in categoryStore.items" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <p v-if="fieldError('category_id')" class="mt-1 text-sm text-red-600">{{ fieldError('category_id') }}</p>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          class="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          :disabled="submitting"
        >
          <LoadingSpinner v-if="submitting" size="sm" />
          {{ isEditing ? 'Guardar cambios' : 'Crear producto' }}
        </button>
        <RouterLink to="/products" class="text-sm font-medium text-slate-600 hover:underline">
          Cancelar
        </RouterLink>
      </div>
    </form>
  </AppLayout>
</template>
