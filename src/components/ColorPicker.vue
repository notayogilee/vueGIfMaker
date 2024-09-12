<script setup>
import ColorPickerItem from './ColorPickerItem.vue'

const colors = [
  ['bg-white', 'bg-slate-500', 'bg-black'],
  ['bg-red-300', 'bg-red-500', 'bg-red-700'],
  ['bg-yellow-400', 'bg-orange-600', 'bg-orange-800'],
  ['bg-emerald-400', 'bg-green-600', 'bg-green-800'],
  ['bg-cyan-400', 'bg-sky-600', 'bg-blue-800'],
  ['bg-purple-400', 'bg-purple-600', 'bg-purple-800']
]

const textColors = [
  ['text-white', 'text-slate-500', 'text-black'],
  ['text-red-300', 'text-red-500', 'text-red-700'],
  ['text-yellow-400', 'text-orange-600', 'text-orange-800'],
  ['text-emerald-400', 'text-green-600', 'text-green-800'],
  ['text-cyan-400', 'text-sky-600', 'text-blue-800'],
  ['text-purple-400', 'text-purple-600', 'text-purple-800']
]

const emit = defineEmits(['update:setTextColor'])

const setTextColor = (index, i) => {
  const textColor = textColors[index][i]
  emit('update:setTextColor', textColor)
}
</script>

<template>
  <div class="max-w-80 my-3 max-h-18 flex justify-center gap-2">
    <div class="flex flex-col gap-2" v-for="(colorSet, index) in colors" :key="`set-${index + 1}`">
      <div class="" v-for="(color, i) in colorSet" :key="color" @click="setTextColor(index, i)">
        <ColorPickerItem :color="color" />
      </div>
    </div>
  </div>
</template>
