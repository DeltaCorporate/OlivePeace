import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.ts'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';

const pinia = createPinia()

const app= createApp(App)
    .use(pinia)
    .use(router)
    .component('VueDatePicker',VueDatePicker)
    .mount('#app')
