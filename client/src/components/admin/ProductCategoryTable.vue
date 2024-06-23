<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories } from '@/api/admin/product-category.api';

const data = reactive([]);
const fetchProductCategories = async () => {
  const result = await getProductCategories();
  data.splice(0, data.length, ...result.data.data);
};

onMounted(() => fetchProductCategories());
</script>

<template>

          <OpTable :data="data" row-key-field="productCategoryId">
            <OpTableCol header="ID" property="productCategoryId"/>
            <OpTableCol header="Actions" v-slot="cellProps">
              <button class="text-primary-600 hover:text-indigo-900" @click="console.log(cellProps.value)">
                Action
              </button>
            </OpTableCol>
          </OpTable>

</template>

<style scoped>
</style>
