<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories } from '@/api/admin/product-category.api';
import {useTable} from "@/composables/useTable.ts";


const {
  data,
  pagination,
  handleSort,
  handlePageChange } = useTable(getProductCategories);

</script>

<template>
  <OpTable :data="data" :pagination="pagination" row-key-field="_id" @sort="handleSort" @pageChange="handlePageChange">
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
