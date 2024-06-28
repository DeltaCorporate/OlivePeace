<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories } from '@/api/admin/product-category.api';
import { useTable } from '@/composables/useTable';

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
} = useTable(getProductCategories);
</script>

<template>
  <OpTable
      :data="data"
      :pagination="pagination"
      row-key-field="_id"
      @sort="handleUpdateFilters"
      @pageChange="handlePageChange"
      @search="handleUpdateFilters"
  >
    <OpTableCol header="Nom" property="name" sortable searchable />
    <OpTableCol header="Description" property="description" sortable searchable />
    <OpTableCol header="Actions" property="actions">
      <template #default="{ row }">
        <button class="text-primary-600 hover:text-indigo-900" @click="console.log(row)">
          Action
        </button>
      </template>
    </OpTableCol>
  </OpTable>
</template>

<style scoped>
</style>
