<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories, deleteProductCategory } from '@/api/admin/product-category.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { UPLOAD_PATH } from "@config/global.ts";

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
    <OpTableCol header="ff">
      <template #default="row">
        <img :src="UPLOAD_PATH + '/' + row.value.imageName" class="w-10 h-10 object-cover rounded-full" />
      </template>
    </OpTableCol>
    <OpTableCol header="Nom" property="name" sortable searchable />
    <OpTableCol header="Description" property="description" sortable searchable />
    <OpTableCol header="Slug" property="slug"/>
    <OpTableCol header="Actions">
      <template #default="row">
        <OpTableActions :row="row" :data="data" editRoute="/" viewRoute="/" :deleteMethod="deleteProductCategory" />
      </template>
    </OpTableCol>
  </OpTable>
</template>

<style scoped>
</style>
