<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '¿Estás seguro?' },
  message: { type: String, default: 'Esta acción no se puede deshacer.' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          @click="emit('confirm')"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
