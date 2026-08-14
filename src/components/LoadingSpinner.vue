<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
  },
})

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}
</script>

<template>
  <div class="flex items-center justify-center gap-2" role="status" aria-live="polite">
    <span
      class="animate-spin rounded-full border-slate-300 border-t-indigo-600"
      :class="sizes[size]"
    />
    <span class="sr-only">Cargando...</span>
  </div>
</template>
