<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()
const productToDelete = ref(null)

onMounted(() => {
  productStore.fetchAll()
})

function askDelete(product) {
  productToDelete.value = product
}

async function confirmDelete() {
  if (!productToDelete.value) return
  await productStore.remove(productToDelete.value.id).catch(() => {})
  productToDelete.value = null
}
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">Productos</h2>
      <RouterLink
        to="/products/create"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        + Nuevo producto
      </RouterLink>
    </div>

    <LoadingSpinner v-if="productStore.loading" size="lg" class="py-12" />

    <div v-else-if="!productStore.items.length" class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
      No hay productos registrados todavía.
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th class="px-4 py-3">Nombre</th>
            <th class="px-4 py-3">Categoría</th>
            <th class="px-4 py-3">Precio</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="product in productStore.items" :key="product.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <p class="font-medium text-slate-900">{{ product.name }}</p>
              <p class="text-xs text-slate-500">{{ product.description }}</p>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ product.category?.name ?? '—' }}</td>
            <td class="px-4 py-3 text-slate-600">S/ {{ Number(product.price).toFixed(2) }}</td>
            <td class="px-4 py-3 text-slate-600">{{ product.stock }}</td>
            <td class="px-4 py-3 text-right">
              <RouterLink
                :to="`/products/${product.id}/edit`"
                class="mr-3 text-indigo-600 hover:underline"
              >
                Editar
              </RouterLink>
              <button type="button" class="text-red-600 hover:underline" @click="askDelete(product)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      :open="Boolean(productToDelete)"
      :title="`Eliminar ${productToDelete?.name ?? ''}`"
      message="Esta acción eliminará el producto de forma permanente."
      @confirm="confirmDelete"
      @cancel="productToDelete = null"
    />
  </AppLayout>
</template>
