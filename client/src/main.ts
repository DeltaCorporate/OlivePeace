import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.ts'

const pinia = createPinia()

const app= createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
