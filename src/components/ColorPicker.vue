<script setup>
import ColorPickerItem from './ColorPickerItem.vue'

const colors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
]
const depths = ['50', '200', '400', '700', '900']
</script>

<template>
  <div class="flex">
    <div v-for="color in colors" :key="color">
      <div v-for="depth in depths" :key="`${color}${depth}`">
        <ColorPickerItem :color="color" :depth="depth" />
      </div>
    </div>
  </div>
</template>
