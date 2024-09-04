<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header>
    <h1 class="text-3xl text-center p-5">{{ title }}</h1>
  </header>
</template>

<style scoped></style>
