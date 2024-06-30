<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories, deleteProductCategory } from '@/api/admin/product-category.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
} = useTable({
  fetchData: getProductCategories,

});
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
    <OpTableCol header="Actions">
      <template #default="row">
        <OpTableActions :row="row" :data="data" editRoute="/" viewRoute="/" :deleteMethod="deleteProductCategory" />
      </template>
    </OpTableCol>
  </OpTable>
</template>

<style scoped>
</style>
