<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { deleteStock } from '@/api/admin/stock.api';
import { getStocks } from '@/api/stock.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { UPLOAD_PATH } from "@/../config/global.ts";
import { errorImage } from "@/utils/image.util.ts";
import { ref } from "vue";

import StockForm from "@/components/admin/StockForm.vue";
import { SfButton, SfIconClose, SfModal, useDisclosure } from "@storefront-ui/vue";

const { isOpen, open, close } = useDisclosure({ initialValue: false });

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
} = useTable({
  fetchData: getStocks,
});

const stockFormModalId = ref<number>();
const openStockFormModal = (id: number) => {
  stockFormModalId.value = id;
  open();
}

onMounted(() => {
  handleUpdateFilters(); // Assurez-vous que les données sont récupérées au montage du composant
});
</script>

<template>
  <SfModal class="z-10 absolute animate-fade md:max-w-[60%]" v-model="isOpen">
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
      <SfIconClose />
    </SfButton>
    <StockForm />
  </SfModal>
  <div class="w-full overflow-auto">
    <OpTable
        :data="data"
        :pagination="pagination"
        row-key-field="_id"
        @sort="handleUpdateFilters"
        @pageChange="handlePageChange"
        @search="handleUpdateFilters"
    >
      <OpTableCol header="Produit" property="product.name" sortable searchable />
      <OpTableCol header="Quantité" property="quantity" sortable searchable />
      <OpTableCol header="Localisation" property="location" sortable searchable />
      <OpTableCol header="Date de création" property="createdAt" sortable>
        <template #default="row">
          {{ new Date(row.value).toLocaleDateString() }}
        </template>
      </OpTableCol>
      <OpTableCol header="Actions">
        <template #default="row">
          <OpTableActions :row="row" :data="data" :editMethod="() => openStockFormModal(row.value._id)" :viewRoute="'/admin/stocks/view/'+row.value._id" :deleteMethod="deleteStock" />
        </template>
      </OpTableCol>
    </OpTable>
  </div>
</template>

<style scoped>
</style>
