<script setup lang="ts">
import { SfInput, SfButton, SfIconSearch } from '@storefront-ui/vue';
import {useRoute, useRouter} from 'vue-router';
import { useProductSearchStore } from '@/stores/productSearch.store';
import {watch} from "vue";

const router = useRouter();
const route = useRoute();
const searchStore = useProductSearchStore();

const goToProductsPage = () => {
  const routeName = router.currentRoute.value.name ?? null;
  if (routeName !== 'products') router.push('/products');
};
watch(() => route.meta.disableSearch, (disableSearch) => {
  if (disableSearch) searchStore.disable();
  else searchStore.enable();
}, { immediate: true });
</script>
<template>
  <form class="flex flex-[100%] order-last lg:order-3 mt-2 lg:mt-0 pb-2 lg:pb-0">
    <SfInput
        v-model="searchStore.searchQuery"
        type="search"
        class="[&::-webkit-search-cancel-button]:appearance-none"
        placeholder="Rechercher des produits..."
        @focusin="goToProductsPage"
        wrapper-class="flex-1 h-10 pr-0"
        :disabled="searchStore.isDisabled"
    >
      <template #suffix>
        <span class="flex items-center">
          <SfButton
              variant="tertiary"
              square
              aria-label="search"
              type="submit"
              class="rounded-l-none hover:bg-transparent active:bg-transparent"
              :disabled="searchStore.isDisabled"
          >
            <SfIconSearch />
          </SfButton>
        </span>
      </template>
    </SfInput>
  </form>
</template>

