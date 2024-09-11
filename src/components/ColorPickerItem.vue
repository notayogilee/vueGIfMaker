<script setup>
import { computed } from 'vue'
const props = defineProps({
  color: {
    type: String,
    required: true
  },
  depth: {
    type: String,
    required: true
  }
})

const colorClass = computed(() => {
  return `bg-${props.color}-${props.depth}`
})
</script>

<template>
  <div class="h-5 w-5" :class="colorClass"></div>
</template>
