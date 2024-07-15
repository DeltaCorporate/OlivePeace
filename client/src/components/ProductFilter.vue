<script setup lang="ts">
import { ref, watch } from 'vue';
import {SfInput, SfCheckbox, SfButton, SfSelect} from '@storefront-ui/vue';
import FilterBuilder from "@/utils/filter.util.ts";

const props = defineProps({
  filterBuilder: {
    type: Object as () => FilterBuilder,
    required: true
  }
});

const selectedSort = ref();
const minPrice = ref('');
const maxPrice = ref('');
const inPromotion = ref(false);
const inStock = ref(false);

const applyFilters = () => {
  props.filterBuilder.clear();

  if(selectedSort.value)
    props.filterBuilder.add(selectedSort.value).ord('ASC');


  if (minPrice.value || maxPrice.value) {
    props.filterBuilder.add('discountedPrice');
    if (minPrice.value) props.filterBuilder.min(parseFloat(minPrice.value));
    if (maxPrice.value) props.filterBuilder.max(parseFloat(maxPrice.value));
  }

  if (inPromotion.value) {
    props.filterBuilder.add('promotion.value').min(1);
  }

  if (inStock.value) {
    props.filterBuilder.add('stock').min(1);
  }
};

const resetFilters = () => {
  selectedSort.value = null;
  minPrice.value = '';
  maxPrice.value = '';
  inPromotion.value = false;
  inStock.value = false;
  applyFilters();
};

watch([selectedSort, minPrice, maxPrice, inPromotion, inStock], applyFilters);
</script>


<template>
  <div class="product-filter">
    <h3 class="typography-headline-4 mb-4">Filtres</h3>

    <div class="mb-4">
      <label class="typography-text-base mb-2 block">Trier par</label>
      <SfSelect
          v-model="selectedSort"
          placeholder="Sélectionnez les tris"
          @input="applyFilters"
      >
        <option value="name">Nom</option>
        <option value="productCategory.name">Catégorie</option>
        <option value="brand">Marque</option>
      </SfSelect>
    </div>

    <div class="mb-4">
      <label class="typography-text-base mb-2 block">Prix</label>
      <div class="flex space-x-2">
        <SfInput
            v-model="minPrice"
            type="number"
            placeholder="Min"
            class="w-1/2"
            @input="applyFilters"
        />
        <SfInput
            v-model="maxPrice"
            type="number"
            placeholder="Max"
            class="w-1/2"
            @input="applyFilters"
        />
      </div>
    </div>



    <div class="flex">
      <SfCheckbox id="inPromotion-checkbox" v-model="inPromotion" @change="applyFilters"/>
      <label class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900" for="inPromotion-checkbox">
        Produits en promotion
      </label>
    </div>
    <div class="flex">
      <SfCheckbox id="inStock-checkbox" v-model="inStock" @change="applyFilters"/>
      <label class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900" for="inStock-checkbox">
        Produits en stock
      </label>
    </div>
    <SfButton class="w-full text-sm my-5" size="sm" @click="resetFilters">Réinitialiser les filtres</SfButton>
  </div>
</template>
