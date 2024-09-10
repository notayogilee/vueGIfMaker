<script setup>
import { ref } from 'vue'

const props = defineProps({
  toggleType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:addText'])

const addText = ref(false)
const setColor = ref(false)
const type = ref(props.toggleType)

const handleToggle = () => {
  if (type.value === 'text') {
    addText.value = !addText.value
    emit('update:addText', addText.value)
  }
  if (type.value === 'textColor') {
    setColor.value = !setColor.value
    emit('update:setFontColor', setColor.value)
  }
}
</script>

<template>
  <label class="switch">
    <input type="checkbox" class="checkbox" @click="handleToggle()" />
    <div class="slider"></div>
  </label>
</template>

<style scoped>
.checkbox {
  display: none;
}

.slider {
  width: 60px;
  height: 30px;
  background-color: lightgray;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 4px solid transparent;
  transition: 0.3s;
  box-shadow: 0 0 10px 0 rgb(0, 0, 0, 0.25) inset;
  cursor: pointer;
}

.slider::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transform: translateX(-30px);
  border-radius: 20px;
  transition: 0.3s;
  box-shadow: 0 0 10px 3px rgb(0, 0, 0, 0.25);
}

.checkbox:checked ~ .slider::before {
  transform: translateX(30px);
  box-shadow: 0 0 10px 3px rgb(0, 0, 0, 0.25);
}

.checkbox:checked ~ .slider {
  background-color: #2196f3;
}

.checkbox:active ~ .slider::before {
  transform: translate(0);
}
</style>
