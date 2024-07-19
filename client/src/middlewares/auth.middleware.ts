import {useAuthStore} from "@/stores/auth.store.ts";
import {useAlertStore} from "@/stores/alerts.store.ts";
import {useRouter} from "vue-router";


export function checkRole(roles : string[]) {
    let authStore = useAuthStore();
    let alertStore = useAlertStore();
    let router = useRouter();
    if(authStore.isAuthenticated && roles.includes(authStore.user.roles))
        return;
    router.push('/').then(()=> {
        alertStore.showAlert("Vous n'avez pas la permission d'accéder à cette page", 'negative');
    });
}
