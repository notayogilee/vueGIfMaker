<script setup>
defineProps({
  width: String,
  height: String,
  id: {
    type: String,
    required: true
  }
})
mounted: {
}
</script>

<template>
  <video
    :id="id"
    :width="width"
    :height="height"
    class="bg-slate-900 my-5 mx-auto"
    autoplay
  ></video>
</template>

<style scoped>
video {
  height: unset !important;
}
</style>
