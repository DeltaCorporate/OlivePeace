import { defineStore } from 'pinia';
import {ref, computed, watch, reactive} from 'vue';
import { useRouter } from 'vue-router';
import { getProducts } from '@/api/product.api';
import { debounce } from '@/utils/debounce.utils';
import FilterBuilder from "@/utils/filter.util.ts";

export const useProductSearchStore = defineStore('productSearch', () => {
    const router = useRouter();
    const searchQuery = ref('');
    const isDisabled = ref(false);
    const filterBuilder = reactive(new FilterBuilder());
    watch(() => searchQuery.value, () => {
        filterBuilder.clear();
        if (searchQuery.value.length > 0) {
                filterBuilder.add('name').contains(searchQuery.value).logic('OR').ord('ASC')
                    .add('description').contains(searchQuery.value).logic('OR');
            }
    });

    const disable = () => {
        isDisabled.value = true;
    };
    const enable = () => {
        isDisabled.value = false;
    };

    return {
        searchQuery,
        isDisabled,
        filterBuilder,
        disable,
        enable,
    };
});