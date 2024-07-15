import { defineStore } from 'pinia';

export const useClientLayoutStore = defineStore('clientLayout', {
    state: () => ({
        pageTitle: ''
    }),
    actions: {
        setPageTitle(title: string) {
            this.pageTitle = title;
        }
    }
});
