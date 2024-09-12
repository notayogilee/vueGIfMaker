<script setup>
const props = defineProps({
  color: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="h-6 w-6 cursor-pointer rounded-full border" :class="props.color"></div>
</template>
