<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {SfLoaderCircular, SfButton, SfLink} from '@storefront-ui/vue';
import { getMostSoldProductByMonth } from '@/api/stats.api';

const props = defineProps({
  title: { type: String, required: true },
  year: { type: Number, default: new Date().getFullYear() }
});

const topProducts = ref([]);
const loading = ref(true);
const error = ref(null);

const loadData = async () => {
  loading.value = true;
  error.value = null;
  const response = await getMostSoldProductByMonth(props.year);
  if (response.isSuccess) topProducts.value = response.data;
  else error.value = "Erreur lors de la récupération des données";

  loading.value = false;
};

onMounted(loadData);
</script>

<template>
  <div class="top-selling-products bg-neutral-50 shadow-md rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <SfLoaderCircular size="lg" />
    </div>
    <div v-else-if="error" class="text-negative-700 text-center h-64 flex flex-col items-center justify-center">
      <p>{{ error }}</p>
      <SfButton class="mt-4" @click="loadData">Rafraîchir</SfButton>
    </div>
    <div v-else>
      <div v-for="(item, index) in topProducts" :key="index" class="mb-2 p-2 rounded">
        <SfButton class="!rounded-full text-sm" size="sm">{{ item.month }}:</SfButton>
        <router-link :to="'/products/'+item.productId"><SfLink class="no-underline">&nbsp;{{ item.productName }}</SfLink></router-link> ({{ item.salesCount }} ventes)
      </div>

    </div>
  </div>
</template>

