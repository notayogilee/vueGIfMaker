import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gifshot from 'gifshot'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use({
  install(app) {
    app.config.globalProperties.$gifshot = gifshot
  }
})
app.mount('#app')
