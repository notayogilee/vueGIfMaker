import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import gifshot from 'gifshot'
import html2canvas from 'html2canvas'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.provide('gifshot', gifshot)
app.provide('html2canvas', html2canvas)
app.mount('#app')
