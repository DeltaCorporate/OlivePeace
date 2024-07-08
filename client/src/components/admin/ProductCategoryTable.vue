<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getProductCategories, deleteProductCategory } from '@/api/admin/product-category.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { UPLOAD_PATH } from "@/../config/global.ts";
import {errorImage} from "@/utils/image.util.ts";

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
  <div class="w-full overflow-auto">
    <OpTable
        :data="data"
        :pagination="pagination"
        row-key-field="_id"
        @sort="handleUpdateFilters"
        @pageChange="handlePageChange"
        @search="handleUpdateFilters"
    >
      <OpTableCol header="">
        <template #default="row">
          <div class="w-16 object-cover aspect-square">
            <img @error="errorImage" :src="UPLOAD_PATH + '/' + row.value.imageName" class="w-16 object-cover aspect-square rounded-full" />

          </div>
        </template>
      </OpTableCol>
      <OpTableCol header="Nom" property="name" sortable searchable />
      <OpTableCol header="Description" property="description" sortable searchable />
      <OpTableCol header="Slug" property="slug"/>
      <OpTableCol header="Date de création" property="createdAt" sortable>
        <template #default="row">
          {{ new Date(row.value).toLocaleDateString() }}
        </template>
      </OpTableCol>
      <OpTableCol header="Actions">
        <template #default="row">
          <OpTableActions :row="row" :data="data" editRoute="'/'" :viewRoute="'/admin/product_categories/view/'+row.value._id" :deleteMethod="deleteProductCategory" />
        </template>
      </OpTableCol>
    </OpTable>
  </div>

</template>

<style scoped>
</style>
