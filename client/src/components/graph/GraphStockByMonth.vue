<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GraphCard from '@/components/ui/GraphCard.vue';
import { getStockPerMonth } from '@/api/stats.api';
import { useGraph } from '@/composables/useGraph';
import {getAllProduct} from "@/api/admin/product.api.ts";

const props = defineProps({
  title: { type: String, required: true,default: 'Stock par mois' }
});

const products = ref([]);
const selectedProductId = ref(null);
const year = ref(new Date().getFullYear());

const { chartData, loading, error, loadData } = useGraph(getStockPerMonth);

const loadProducts = async () => {
  const response = await getAllProduct('f_name=ord:ASC');
  if (response.isSuccess) {
    products.value = response.data;
    if (Object.keys(products.value).length > 0) {
      selectedProductId.value = products.value[0]._id;
      refreshData();
    }
  }
};

const refreshData = () => {
  if (selectedProductId.value) {
    loadData(selectedProductId.value, year.value);
  }
};

onMounted(loadProducts);
</script>

<template>
  <GraphCard
      :title="title"
      :chartData="chartData"
      :loading="loading"
      :error="error"
      @refresh="refreshData"
  >
    <template #toolbar>
      <div class="w-full p-2">
        <input
            v-model.number="year"
            type="number"
            pattern="\d{4}"
            class="border rounded px-2 py-1 mt-2"
            @change="refreshData"
        />
        <select
            v-model="selectedProductId"
            class="border rounded px-2 py-1 mt-2 ml-2"
            @change="refreshData"
        >
          <option v-for="product in products" :key="product._id" :value="product._id">
            {{ product.name }}
          </option>
        </select>
      </div>
    </template>
  </GraphCard>
</template>