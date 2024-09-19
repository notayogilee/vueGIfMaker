<script setup>
import { computed } from 'vue'
import { useEditStore } from '../stores/editStore'
import { storeToRefs } from 'pinia'

const store = useEditStore()
const { text } = storeToRefs(store)

const props = defineProps({
  loc: {
    type: String,
    required: true
  }
})

const fontSizes = ['text-base', 'text-lg', 'text-xl', 'text-2xl']
const fontWeights = [
  'font-normal',
  'font-medium',
  'font-semibold',
  'font-bold',
  'font-extrabold',
  'font-black'
]

const fontSizeIndex = computed(() => {
  return parseInt(text.value[props.loc].fontSize)
})

const fontWeightIndex = computed(() => {
  return parseInt(text.value[props.loc].fontWeight)
})

const textColor = computed(() => {
  return text.value[props.loc].color
})

const enteredText = computed(() => {
  return text.value[props.loc].text
})

const verticalAlign = computed(() => {
  return props.loc === 'middle' ? 'items-center' : props.loc === 'bottom' ? 'items-end' : ''
})
</script>

<template>
  <div class="flex max-w-48 mx-auto min-h-14 m-0 p-0" :class="verticalAlign">
    <h3
      class="text-center max-w-full w-full break-words m-0 p-0"
      :class="[fontSizes[fontSizeIndex], fontWeights[fontWeightIndex], textColor]"
    >
      {{ enteredText }}
    </h3>
  </div>
</template>
