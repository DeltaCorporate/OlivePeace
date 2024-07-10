<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getPromotions, deletePromotion } from '@/api/admin/promotion.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
} = useTable({
  fetchData: getPromotions,
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
    <OpTableCol header="Valeur" property="value" sortable searchable />
    <OpTableCol header="Date d'expiration" property="expirationDate" sortable>
      <template #default="row">
        {{ new Date(row.value).toLocaleDateString('fr-FR') }}
      </template>
    </OpTableCol>
    <OpTableCol header="Actions">
      <template #default="row">
        <OpTableActions :row="row" :data="data" editRoute="/" viewRoute="/" :deleteMethod="deletePromotion" />
      </template> 
    </OpTableCol>
  </OpTable>
</template>

