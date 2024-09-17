<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'
import ColorPicker from './components/ColorPicker.vue'
// import ToggleSwitch from './components/ToggleSwitch.vue'
import { ref, inject, computed } from 'vue'
import { useEditStore } from './stores/editStore'
import { storeToRefs } from 'pinia'

const store = useEditStore()

const { text, isEditing } = storeToRefs(store)

const { updateIsEditing } = store

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

const fontSizes = ['text-base', 'text-lg', 'text-xl', 'text-2xl']
const fontWeights = [
  'font-normal',
  'font-medium',
  'font-semibold',
  'font-bold',
  'font-extrabold',
  'font-black'
]

const savedRenderingContexts = ref([])
const currentSavedRenderingContexts = ref(null)
const currentStep = ref('recording')
const currentGifSrc = ref('')

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

const hasText = computed(() => {
  return store.text.top.text || store.text.middle.text || store.text.bottom.text
})

const gifshot = inject('gifshot')

const generateGIF = (obj) => {
  let image = obj.image
  currentGifSrc.value = image
}

const cancelEditText = () => {
  text[isEditing].value = ''
  text[isEditing].fontSize.value = '0'
  text[isEditing].fontWeight.value = '0'

  updateIsEditing(null)
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
        // console.log(`progress: ${captureProgress}`)

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

    <section id="editSection" class="mx-auto my-3 min-w-80" v-if="currentStep === 'edit'">
      <div id="gifElement" class="flex justify-center relative">
        <img :src="currentGifSrc" alt="" />
        <div v-if="hasText" class="absolute top-0 flex flex-col h-full w-full justify-between p-2">
          <h3
            class="text-center"
            :class="[
              fontSizes[parseInt(store.text.top.fontSize)],
              fontWeights[parseInt(store.text.top.fontWeight)],
              store.text.top.color
            ]"
          >
            {{ store.text.top.text }}
          </h3>
          <h3
            class="text-center"
            :class="[
              fontSizes[parseInt(store.text.middle.fontSize)],
              fontWeights[parseInt(store.text.middle.fontWeight)],
              store.text.middle.color
            ]"
          >
            {{ store.text.middle.text }}
          </h3>
          <h3
            class="text-center"
            :class="[
              fontSizes[parseInt(store.text.bottom.fontSize)],
              fontWeights[parseInt(store.text.bottom.fontWeight)],
              store.text.bottom.color
            ]"
          >
            {{ store.text.bottom.text }}
          </h3>
        </div>
      </div>

      <div v-if="!isEditing" class="flex flex-col gap-2 mt-2">
        <TheButton
          :text="!isEditing ? 'Add text to top' : 'Edit top text'"
          class="w-full"
          @click="updateIsEditing('top')"
        />
        <TheButton :text="'Add text to middle'" class="w-full" @click="updateIsEditing('middle')" />
        <TheButton :text="'Add text to bottom'" class="w-full" @click="updateIsEditing('bottom')" />
      </div>

      <!-- here -->

      <div v-if="isEditing" class="p-4 rounded-md bg-slate-900 flex flex-col mt-5">
        <input
          v-model="store.text[isEditing].text"
          type="text"
          placeholder="Add text to top"
          class="border border-black rounded-md placeholder:text-black px-2 py-1"
        />
        <div class="flex justify-evenly mt-3">
          <label for="fontSize" class="text-white">Font Size</label>
          <input v-model="store.text[isEditing].fontSize" type="range" min="0" max="3" step="1" />
        </div>
        <div class="flex justify-evenly mt-3">
          <label for="fontWeight" class="text-white">Thickness</label>
          <input v-model="store.text[isEditing].fontWeight" type="range" min="0" max="5" step="1" />
        </div>
        <ColorPicker />
        <TheButton :text="'Add Changes'" class="w-full my-2" @click="updateIsEditing(null)" />
        <TheButton
          :text="'Cancel'"
          :bgColor="'bg-red-600'"
          class="w-full my-2"
          @click="cancelEditText()"
        />
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
