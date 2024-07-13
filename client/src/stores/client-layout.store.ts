import { defineStore } from 'pinia';

export const useClientLayout = defineStore('clientLayout', {
    state: () => ({
        pageTitle: ''
    }),
    actions: {
        setPageTitle(title: string) {
            this.pageTitle = title;
        }
    }
});
