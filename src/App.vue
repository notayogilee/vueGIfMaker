<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'

const startRecording = async () => {
  const videoElement = document.getElementById('videoElement')
  // Request access to the camera
  let stream = await navigator.mediaDevices.getUserMedia({ video: true })
  // Assign the stream to the video element's source
  videoElement.srcObject = stream
}
</script>

<template>
  <TheHeader title="Start by recording a short video" />

  <main class="flex flex-col">
    <VideoItem id="videoElement" height="400" width="400" />
    <TheButton
      @click="startRecording"
      text="Start Recording"
      bgColor="bg-emerald-500"
      textColor="text-white"
    />
  </main>
</template>

<style scoped>
/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>
