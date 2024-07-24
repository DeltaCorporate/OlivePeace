// src/composables/useTokenExpirationChecker.ts

import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { checkTokenExpiration } from '@/api/auth.api';
import { useRouter } from 'vue-router';

export function useTokenExpirationChecker() {
    const authStore = useAuthStore();
    const router = useRouter();
    const isChecking = ref(false);
    const checkExpiration = async () => {
        if (!authStore.isAuthenticated || isChecking.value)
            return;
            isChecking.value = true;
            const response = await checkTokenExpiration();
            if (response.code === 401) {
                authStore.clearAuth();
               await router.push('/auth/login');
            }
            isChecking.value = false;
    };

    function checkExpirationEvery(seconds: number) {
        setInterval(checkExpiration, seconds * 1000);
    }
    return {
        checkExpirationEvery,
        checkExpiration
    };
}