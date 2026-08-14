<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const links = computed(() => {
  const base = [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Productos' },
    { to: '/categories', label: 'Categorías' },
  ]

  if (authStore.isAdmin) {
    base.push({ to: '/users', label: 'Usuarios' })
  }

  return base
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-slate-900">Overskull · Gestión de Productos</h1>
        <nav class="flex items-center gap-4">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            active-class="bg-indigo-50 text-indigo-700"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-500">{{ authStore.user?.name }}</span>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            @click="handleLogout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
