<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'
import ToggleSwitch from './components/ToggleSwitch.vue'
import { ref, inject, computed } from 'vue'

//state
const steps = {
  recording: {
    title: 'Start by recording a short video',
    btnText: 'Start Recording',
    btnBgColorClass: 'bg-emerald-500',
    btnTextColorClass: 'text-white',
    showContinueBtn: true
  },
  edit: {
    title: 'Customize your gif?',
    btnText: 'Edit GIF',
    btnBgColorClass: 'bg-emerald-500',
    btnTextColorClass: 'text-white',
    showContinueBtn: false
  }
}

const savedRenderingContexts = ref([])
const currentSavedRenderingContexts = ref(null)
const currentStep = ref('recording')
const currentGifSrc = ref('')
const addText = ref(false)
const topText = ref('')
const midText = ref('')
const bottomText = ref('')

const title = computed(() => {
  return steps[currentStep.value].title
})

const btnText = computed(() => {
  return steps[currentStep.value].btnText
})

const btnBgColorClass = computed(() => {
  return steps[currentStep.value].btnBgColorClass
})

const btnTextColorClass = computed(() => {
  return steps[currentStep.value].btnTextColorClass
})

const showContinueBtn = computed(() => {
  return steps[currentStep.value].showContinueBtn
})

const gifshot = inject('gifshot')

const generateGIF = (obj) => {
  let image = obj.image
  currentGifSrc.value = image
}

const updateAddText = (data) => {
  addText.value = data
}

const startRecording = async () => {
  const videoElement = document.getElementById('videoElement')

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
            // Stop the stream
            stream.getTracks().forEach((track) => track.stop())
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
        // Next step
        currentStep.value = 'edit'

        // Save the rendering contexts for later use
        currentSavedRenderingContexts.value = obj.savedRenderingContexts
        savedRenderingContexts.value = [...savedRenderingContexts.value, obj.savedRenderingContexts]

        generateGIF(obj)
      }
    }
  )
}
</script>

<template>
  <TheHeader :title="title" />

  <main class="flex flex-col">
    <VideoItem id="videoElement" height="400" width="400" v-if="currentStep === 'recording'" />

    <section id="editSection" class="mx-auto my-3" v-if="currentStep === 'edit'">
      <div id="gifElement" class="mx-auto relative">
        <img :src="currentGifSrc" alt="" />
        <div v-if="addText" class="absolute top-0 flex flex-col h-full w-full justify-between p-2">
          <input type="text" name="" id="" />
          <input type="text" name="" id="" />
          <input type="text" name="" id="" />
        </div>
      </div>
      <h3 class="text-xl">Add Some Text?</h3>

      <ToggleSwitch @update:addText="updateAddText" />

      <h3 class="text-xl">Where?</h3>

      <div class="mb-1">
        <input type="radio" id="top" name="textPlacement" value="top" />
        <label for="top" class="ms-2">Top</label>
      </div>

      <div class="mb-1">
        <input type="radio" id="middle" name="textPlacement" value="middle" />
        <label for="middle" class="ms-2">Middle</label>
      </div>

      <div class="mb-1">
        <input type="radio" id="bottom" name="textPlacement" value="bottom" checked />
        <label for="bottom" class="ms-2">Bottom</label>
      </div>
    </section>
    <TheButton
      @click="startRecording"
      :text="btnText"
      :bgColor="btnBgColorClass"
      :textColor="btnTextColorClass"
      v-if="showContinueBtn"
    />
  </main>
</template>

<style scoped></style>
