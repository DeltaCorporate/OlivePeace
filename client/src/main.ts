import {createApp} from 'vue'
import './index.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router/index.ts'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import {useAuthStore} from "@/stores/auth.store.ts";
import apiClient from '@/../config/axios';
import {useTokenExpirationChecker} from "@/composables/useTokenExpirationChecker.ts";
import {useAlertStore} from "@/stores/alerts.store.ts";
import {formatAxiosError, pickError} from "@/utils/response.util.ts";
const pinia = createPinia()

const app= createApp(App)
    .use(pinia)
    .use(router)
    .component('VueDatePicker',VueDatePicker)

const {checkExpirationEvery,checkExpiration} = useTokenExpirationChecker();
const alertStore = useAlertStore();
const authStore = useAuthStore();
checkExpirationEvery(60);
apiClient.interceptors.request.use((config) => {
    if(authStore.isAuthenticated)
        config.headers['Authorization'] = `Bearer ${authStore.token}`;
    return config;
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
        let errorFormated = formatAxiosError(error);
        if(errorFormated.code === 403) {
                router.push('/').then(()=> {
                    alertStore.showAlert("Vous ne pouvez pas accéder à cette page", 'negative');
                });
        }
        if(errorFormated.code === 401){
            authStore.clearAuth();
            await router.push('/auth/login');
            alertStore.showAlert("Vous n'êtes pas connecté", 'negative');

        }
        return Promise.reject(error);
    }
);



app.mount('#app');