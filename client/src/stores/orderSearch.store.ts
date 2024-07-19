import { defineStore } from 'pinia';
import FilterBuilder from '@/utils/filter.util';

export const useOrderSearchStore = defineStore('orderSearch', {
    state: () => ({
        filterBuilder: new FilterBuilder(),
    }),
    actions: {
        setFilter(filter: string, value: any) {
            this.filterBuilder.setFilter(filter, value);
        },
        resetFilters() {
            this.filterBuilder.reset();
        }
    }
});
