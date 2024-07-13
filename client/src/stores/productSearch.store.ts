import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getProducts } from '@/api/product.api';
import { debounce } from '@/utils/debounce.utils';

export const useProductSearchStore = defineStore('productSearch', () => {
    const router = useRouter();
    const searchQuery = ref('');
    const isDisabled = ref(false);

    const handleSearch = debounce(async () => {
        if (router.currentRoute.value.name !== 'products') {
            router.push({ name: 'products' });
        }

        const filterBuilder = new FilterBuilder();
        if (searchQuery.value.length > 0) {
            filterBuilder.add('name').contains(searchQuery.value).logic('OR').ord('ASC')
                .add('description').contains(searchQuery.value).logic('OR');
        }

        try {
            const response = await getProducts(filterBuilder.build());
            } catch (error) {
            console.error("Impossible de charger les produits", error);
        }
    }, 300);

    const disable = () => {
        isDisabled.value = true;
    };

    const enable = () => {
        isDisabled.value = false;
    };

    return {
        searchQuery,
        isDisabled,
        handleSearch,
        disable,
        enable,
    };
});