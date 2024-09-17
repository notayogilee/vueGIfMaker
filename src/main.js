import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import gifshot from 'gifshot'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.provide('gifshot', gifshot)
app.mount('#app')
