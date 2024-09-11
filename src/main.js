import './index.css'

import { createApp } from 'vue'
import gifshot from 'gifshot'
import App from './App.vue'

const app = createApp(App)

app.provide('gifshot', gifshot)
app.mount('#app')
