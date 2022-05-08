import { createApp } from 'vue'
import router from './router'
import './assets/css/normalize.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
