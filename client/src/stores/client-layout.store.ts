import { defineStore } from 'pinia';

export const useClientLayoutStore = defineStore('clientLayout', {
    state: () => ({
        pageTitle: '',
        isCustomTitle: false
    }),
    actions: {
        setPageTitle(title: string) {
            this.pageTitle = title;
        },
        setIsCustomTitle(isCustomTitle: boolean) {
            this.isCustomTitle = isCustomTitle;
        }
    }
});
