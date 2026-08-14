<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const loading = computed(() => productStore.loading || categoryStore.loading)

const totalStock = computed(() =>
  productStore.items.reduce((total, product) => total + Number(product.stock), 0),
)

const inventoryValue = computed(() =>
  productStore.items.reduce((total, product) => total + Number(product.price) * Number(product.stock), 0),
)

const lowStockProducts = computed(() =>
  [...productStore.items].filter((product) => product.stock <= 5).slice(0, 5),
)

onMounted(() => {
  productStore.fetchAll()
  categoryStore.fetchAll()
})
</script>

<template>
  <AppLayout>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">Dashboard</h2>
    </div>

    <LoadingSpinner v-if="loading" size="lg" class="py-12" />

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Total de productos</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ productStore.items.length }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Total de categorías</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ categoryStore.items.length }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Unidades en stock</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ totalStock }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Valor de inventario</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">S/ {{ inventoryValue.toFixed(2) }}</p>
      </div>
    </div>

    <div v-if="!loading && lowStockProducts.length" class="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <h3 class="font-semibold text-amber-900">Productos con bajo stock</h3>
      <ul class="mt-3 divide-y divide-amber-200">
        <li v-for="product in lowStockProducts" :key="product.id" class="flex justify-between py-2 text-sm">
          <span class="text-amber-900">{{ product.name }}</span>
          <span class="font-medium text-amber-900">{{ product.stock }} unidades</span>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>
