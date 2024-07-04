import { defineStore } from 'pinia';

export const useAdminLayoutStore = defineStore('adminLayout', {
    state: () => ({
        pageTitle: ''
    }),
    actions: {
        setPageTitle(title: string) {
            this.pageTitle = title;
        }
    }
});
