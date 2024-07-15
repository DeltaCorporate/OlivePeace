import { defineStore } from 'pinia';

export const useCartLayoutStore = defineStore('cart', {
    state: () => ({
        pageTitle: ''
    }),
    actions: {
        setPageTitle(title: string) {
            this.pageTitle = title;
        }
    }
});
