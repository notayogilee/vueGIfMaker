<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: 'bg-emerald-500'
  },
  textColor: {
    type: String,
    default: 'text-white'
  }
})
</script>

<template>
  <button :class="[bgColor, textColor]" class="py-2 px-8 rounded w-fit mx-auto">{{ text }}</button>
</template>
