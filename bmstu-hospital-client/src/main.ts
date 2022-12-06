import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { removeCsrfCookie } from './csrf'

import './assets/main.css'

// removeCsrfCookie()
const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)


app.mount('#app')
