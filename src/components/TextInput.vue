<script setup>
import { computed } from 'vue'
import { useEditStore } from '../stores/editStore'
import { storeToRefs } from 'pinia'

const store = useEditStore()
const { text, isEditing } = storeToRefs(store)

const props = defineProps({
  hasLabel: {
    type: Boolean,
    required: true
  },
  labelText: {
    type: String,
    required: false
  },
  inputType: {
    type: String,
    required: true
  },
  textData: {
    type: String,
    required: true
  },
  maxlength: {
    type: String,
    required: false,
    default: ''
  },
  min: {
    type: String,
    required: false,
    default: ''
  },
  max: {
    type: String,
    required: false,
    default: ''
  },
  step: {
    type: String,
    required: false,
    default: ''
  }
})

const inputClasses = computed(() => {
  return props.inputType === 'text'
    ? 'border border-black rounded-md placeholder:text-black px-2 py-1'
    : ''
})

const placeholder = computed(() => {
  return props.inputType === 'text' ? `Add text to ${isEditing.value}` : ''
})
</script>

<template>
  <div class="flex justify-evenly mt-3">
    <label v-if="hasLabel" :for="textData" class="text-white">{{ labelText }}</label>
    <input
      v-model="text[isEditing][textData]"
      :type="inputType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
    />
  </div>
</template>
