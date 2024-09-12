<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'
import ColorPicker from './components/ColorPicker.vue'
// import ToggleSwitch from './components/ToggleSwitch.vue'
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
const isEditing = ref(null)
const addText = ref(false)
const topText = ref('')
const topTextFontSize = ref('0')
const topTextFontWeight = ref('0')
const midText = ref('')
const bottomText = ref('')
// const setFontColor = ref()
const textColor = ref('text-black')

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

const topTextFS = computed(() => {
  return topTextFontSize.value === '1'
    ? 'text-lg'
    : topTextFontSize.value === '2'
      ? 'text-xl'
      : topTextFontSize.value === '3'
        ? 'text-2xl'
        : 'text-base'
})

const topTextFW = computed(() => {
  return topTextFontWeight.value === '1'
    ? 'font-medium'
    : topTextFontWeight.value === '2'
      ? 'font-semibold'
      : topTextFontWeight.value === '3'
        ? 'font-bold'
        : topTextFontWeight.value === '4'
          ? 'font-extrabold'
          : topTextFontWeight.value === '5'
            ? 'font-black'
            : 'font-normal'
})

const topTextColor = computed(() => {
  return textColor.value
})

const gifshot = inject('gifshot')

const generateGIF = (obj) => {
  let image = obj.image
  currentGifSrc.value = image
}

const editText = (loc) => {
  addText.value = true
  isEditing.value = loc
}

// const updateAddText = (data) => {
//   addText.value = data
// }

const updateSetTextColor = (data) => {
  textColor.value = data
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

    <section id="editSection" class="mx-auto my-3 min-w-80" v-if="currentStep === 'edit'">
      <div id="gifElement" class="flex justify-center relative">
        <img :src="currentGifSrc" alt="" />
        <div v-if="addText" class="absolute top-0 flex flex-col h-full w-full justify-between p-2">
          <h3 class="text-center" :class="[topTextFS, topTextFW, topTextColor]">
            {{ topText }}
          </h3>
          <h3 class="text-center" :style="{ color: textColor }">{{ midText }}</h3>
          <h3 class="text-center" :style="{ color: textColor }">{{ bottomText }}</h3>
        </div>
      </div>

      <div v-if="!isEditing" class="flex flex-col gap-2 mt-2">
        <TheButton :text="'Add text to top'" class="w-full" @click="editText('top')" />
        <TheButton :text="'Add text to middle'" class="w-full" @click="editText('mid')" />
        <TheButton :text="'Add text to bottom'" class="w-full" @click="editText('bottom')" />
      </div>

      <div
        id="topTextEdit"
        v-if="isEditing === 'top'"
        class="p-4 rounded-md bg-slate-900 flex flex-col mt-5"
      >
        <input
          v-model="topText"
          type="text"
          name=""
          id=""
          placeholder="Add text to top"
          class="border border-black rounded-md placeholder:text-black px-2 py-1"
        />
        <div class="flex justify-evenly mt-3">
          <label for="fontSize" class="text-white">Font Size</label>
          <input v-model="topTextFontSize" type="range" min="0" max="3" step="1" />
        </div>
        <div class="flex justify-evenly mt-3">
          <label for="fontWeight" class="text-white">Thickness</label>
          <input v-model="topTextFontWeight" type="range" min="0" max="5" step="1" />
        </div>
        <ColorPicker @update:setTextColor="updateSetTextColor" />
        <TheButton :text="'Add Text'" class="w-full my-2" @click="setFontColor = true" />
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
