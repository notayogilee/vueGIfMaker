<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'
import { ref, inject } from 'vue'

//state
const savedRenderingContexts = ref(null)
const finishedRecording = ref(false)

const gifshot = inject('gifshot')

const startRecording = async () => {
  const videoElement = document.getElementById('videoElement')

  const gifElement = document.getElementById('gifElement')
  // Request access to the camera
  let stream = await navigator.mediaDevices.getUserMedia({ video: true })
  // Assign the stream to the video element's source
  videoElement.srcObject = stream

  gifshot.createGIF(
    {
      gifWidth: 200,
      gifHeight: 200,
      sampleInterval: 10,
      numFrames: 10, // number of frames used in gif - this will increase time
      interval: 0.1, // higher increase speed
      frameDuration: 1,
      offset: 100,
      progressCallback: function (captureProgress) {
        console.log(`progress: ${captureProgress}`)

        if (captureProgress === 1) {
          if (stream) {
            // Stop all tracks in the stream
            stream.getTracks().forEach((track) => track.stop())
            console.log('Stream stopped')
          }
        }
      },
      completeCallback: function () {
        console.log('completed')
      },
      saveRenderingContexts: true
    },
    function (obj) {
      if (!obj.error) {
        // hide record section

        // Save the rendering contexts for later use
        savedRenderingContexts.value = obj.savedRenderingContexts

        var image = obj.image,
          animatedImage = document.createElement('img')
        animatedImage.src = image
        animatedImage.id = 'animatedImage'
        gifElement.appendChild(animatedImage)
      }
    }
  )
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
    <div id="gifElement"></div>
  </main>
</template>

<style scoped></style>
