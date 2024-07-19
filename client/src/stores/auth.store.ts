// src/stores/auth.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {UserInfo} from "@/types/user.type.ts";
import {useAlertStore} from "@/stores/alerts.store.ts";
import {isNullUndefined} from "@/utils/divers.util.ts";



export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null);
    const user = ref<UserInfo | null>(null);
    const alertStore = useAlertStore();
    const isAuthenticated = computed(() => !!token.value);

    const fullName = computed(() => {
        if (user.value) {
            return `${user.value.lastName.toUpperCase()} ${user.value.firstName.toLowerCase()}`;
        }
        return '';
    });

    function setAuth(newToken: string, userInfo: UserInfo) {
        token.value = newToken;
        user.value = {...userInfo};
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
    }

    function clearAuth() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    function logout() {
        clearAuth();
        alertStore.showAlert('Vous avez bien été deconnecté', 'positive');
        this.router.push('/');
    }
    // Initialize auth state from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!isNullUndefined(storedToken) && !isNullUndefined(storedUser)) {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
    }

    return {
        token,
        user,
        isAuthenticated,
        fullName,
        logout,
        setAuth,
        clearAuth
    };
});