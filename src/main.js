import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gifshot from 'gifshot'
import '@cyhnkckali/vue3-color-picker/dist/style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.provide('gifshot', gifshot)
app.mount('#app')
