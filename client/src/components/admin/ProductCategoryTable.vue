<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories } from '@/api/admin/product-category.api';

const data = reactive([]);
const fetchProductCategories = async (params: string = '') => {
  const result = await getProductCategories(params);
  data.splice(0, data.length, ...result.data.data);
};

onMounted(() => fetchProductCategories());

function handleSort(filterBuilder: any) {
  fetchProductCategories(filterBuilder.build());
}
</script>

<template>
  <OpTable :data="data" row-key-field="productCategoryId" @sort="handleSort">
      <OpTableCol header="Nom" property="name" sortable />
      <OpTableCol header="Description" property="description" sortable />
      <OpTableCol header="Actions" property="actions">
          <button class="text-primary-600 hover:text-indigo-900" @click="console.log(row)">
            Action
          </button>
      </OpTableCol>
  </OpTable>
</template>

<style scoped>
</style>
