<script setup>
import TheHeader from './components/TheHeader.vue'
import VideoItem from './components/VideoItem.vue'
import TheButton from './components/TheButton.vue'
import ColorPicker from './components/ColorPicker.vue'
import GifText from './components/GifText.vue'
import TextInput from './components/TextInput.vue'
// import ToggleSwitch from './components/ToggleSwitch.vue'
import { ref, inject, computed } from 'vue'
import { useEditStore } from './stores/editStore'
import { storeToRefs } from 'pinia'

const gifshot = inject('gifshot')
const html2canvas = inject('html2canvas')

const store = useEditStore()

const { text, isEditing } = storeToRefs(store)

const { updateIsEditing, cancelEditText } = store

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
const currentSavedRenderingContexts = ref([])
const currentStep = ref('recording')
const currentGifSrc = ref('')
const showOverlay = ref(false)

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

// const hasText = computed(() => {
//   return text.value['top'].text || text.value['middle'].text || text.value['bottom'].text
// })

const generateGIF = (obj) => {
  let image = obj.image
  currentGifSrc.value = image
}

const generateOverlay = () => {
  showOverlay.value = false
  const overlaySection = document.getElementById('overlaySection')
  // generated img has some empty space on top
  overlaySection.classList.remove('p-0')
  overlaySection.classList.add('pb-2')
  overlaySection.classList.add('min-h-56')

  html2canvas(overlaySection, { backgroundColor: null }).then(function (canvas) {
    // Create a temporary canvas to crop the unwanted space
    let croppedCanvas = document.createElement('canvas')
    let croppedContext = croppedCanvas.getContext('2d')

    let cropTop = 10
    let cropWidth = canvas.width
    let cropHeight = canvas.height - cropTop

    croppedCanvas.width = cropWidth
    croppedCanvas.height = cropHeight

    // Draw only the cropped area
    croppedContext.drawImage(canvas, 0, cropTop, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    const imgElSrc = croppedCanvas.toDataURL('image/png')
    let imgEl = document.createElement('img')
    imgEl.src = imgElSrc

    generateModifiedGif(imgElSrc)
    overlaySection.classList.add('p-0')
    overlaySection.classList.remove('pb-2')
    overlaySection.classList.remove('min-h-56')
  })
}

function overlayImageOnFrame(baseImageData, overlayImageSrc, callback) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  // Create a new canvas to hold the base image (ImageData)
  let tempCanvas = document.createElement('canvas')
  tempCanvas.width = baseImageData.width
  tempCanvas.height = baseImageData.height
  let tempCtx = tempCanvas.getContext('2d')

  // Put ImageData on the temporary canvas
  tempCtx.putImageData(baseImageData, 0, 0)

  // Convert canvas with ImageData to a data URL
  let baseImageDataURL = tempCanvas.toDataURL()

  // Load base image (now as a data URL)
  let baseImg = new Image()
  let overlayImg = new Image()

  // Handle base image loading
  baseImg.onload = function () {
    canvas.width = baseImg.width
    canvas.height = baseImg.height

    // Draw base image
    ctx.drawImage(baseImg, 0, 0)

    // Wait for overlay image to load
    overlayImg.onload = function () {
      // Position overlay in the center (adjust as needed)
      let x = (canvas.width - overlayImg.width) / 2
      let y = (canvas.height - overlayImg.height) / 2

      // Draw overlay image
      ctx.drawImage(overlayImg, x, y)

      // Convert canvas to a data URL and pass it to the callback
      let modifiedImage = canvas.toDataURL()
      console.log(modifiedImage)
      callback(modifiedImage)
    }

    overlayImg.onerror = function () {
      console.error('Error loading overlay image:', overlayImageSrc)
    }

    overlayImg.src = overlayImageSrc // Load overlay image
  }

  baseImg.onerror = function () {
    console.error('Error loading base image:', baseImageDataURL)
  }

  baseImg.src = baseImageDataURL // Set the base image source as the data URL
}

const generateModifiedGif = (overlaySrc) => {
  let modifiedFrames = []

  let processedFrames = 0

  currentSavedRenderingContexts.value.forEach((frameSrc) => {
    overlayImageOnFrame(frameSrc, overlaySrc, (modifiedFrame) => {
      modifiedFrames.push(modifiedFrame)
      processedFrames++

      if (processedFrames === currentSavedRenderingContexts.value.length) {
        gifshot.createGIF(
          {
            images: modifiedFrames,
            gifWidth: 208,
            gifHeight: 208,
            sampleInterval: 10,
            numFrames: 10,
            interval: 0.1,
            frameDuration: 1,
            offset: 100
          },
          function (obj) {
            if (!obj.error) {
              let modGif = document.createElement('img')
              modGif.src = obj.image

              generateGIF(obj)
            }
          }
        )
      }
    })
  })
}

const startRecording = async () => {
  const videoElement = document.getElementById('videoElement')

  // Request access to the camera
  let stream = await navigator.mediaDevices.getUserMedia({ video: true })
  // Assign the stream to the video element's source
  videoElement.srcObject = stream

  gifshot.createGIF(
    {
      gifWidth: 208,
      gifHeight: 208,
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

        showOverlay.value = true
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
      <div id="gifElement" class="flex justify-center relative w-52 mx-auto">
        <img :src="currentGifSrc" alt="" />
        <div
          v-if="showOverlay"
          id="overlaySection"
          class="absolute top-0 flex flex-col items-center h-full w-full justify-between p-0 m-0 box-border bg-transparent"
        >
          <GifText :loc="'top'" />
          <GifText :loc="'middle'" />
          <GifText :loc="'bottom'" />
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
        <TheButton :text="'Finished Edit'" class="w-full" @click="generateOverlay()" />
      </div>

      <!-- here -->

      <div v-if="isEditing" class="p-4 rounded-md bg-slate-900 flex flex-col mt-5">
        <TextInput :hasLabel="false" :inputType="'text'" :textData="'text'" :maxlength="'25'" />
        <TextInput
          :hasLabel="true"
          :labelText="'Font Size'"
          :inputType="'range'"
          :textData="'fontSize'"
          :min="'0'"
          :max="'3'"
          :step="'1'"
        />
        <TextInput
          :hasLabel="true"
          :labelText="'Thickness'"
          :inputType="'range'"
          :textData="'fontWeight'"
          :min="'0'"
          :max="'5'"
          :step="'1'"
        />

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
