import { createApp } from 'vue'
import App from './App.vue'
import gifshot from 'gifshot'
import './index.css'

const app = createApp(App)

app.provide('gifshot', gifshot)
app.mount('#app')
