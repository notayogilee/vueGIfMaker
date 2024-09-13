<script setup>
import TheButton from './TheButton.vue'
import ColorPicker from './ColorPicker.vue'

defineProps({
  editLocation: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div v-if="isEditing === 'top'" class="p-4 rounded-md bg-slate-900 flex flex-col mt-5">
    <input
      v-model="topText"
      type="text"
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
    <TheButton :text="'Add Text'" class="w-full my-2" @click="setText()" />
    <TheButton
      :text="'Cancel'"
      :bgColor="'bg-red-600'"
      class="w-full my-2"
      @click="cancelEditText('top')"
    />
  </div>
</template>
