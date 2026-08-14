<script setup>
const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-slate-900">Overskull · Gestión de Productos</h1>
        <nav class="flex gap-4">
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
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
