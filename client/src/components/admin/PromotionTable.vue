<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { getPromotions, deletePromotion } from '@/api/admin/promotion.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import {SfButton, SfIconClose, SfModal, useDisclosure} from "@storefront-ui/vue";
import {ref} from "vue";
import PromotionForm from "@/components/admin/PromotionForm.vue";
const { isOpen, open, close } = useDisclosure({ initialValue: false });

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
    fetchTableData,
} = useTable({
  fetchData: getPromotions,
});

const promotionFormModalId = ref<number>();
const openPromotionFormModal = (id: number) => {
  promotionFormModalId.value = id;
  open();
}

</script>
<template class="relative">
  <SfButton @click="openPromotionFormModal(null)" class="mb-4" variant="primary">
    Ajouter une promotion
  </SfButton>
  <div v-if="isOpen" class="fixed inset-0 z-10 bg-neutral-700 bg-opacity-50" />
  <SfModal class="z-10 absolute  animate-fade md:max-w-[60%]" v-model="isOpen">
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </SfButton>
    <PromotionForm
        @success="fetchTableData"
        :id="promotionFormModalId"
    />
    </SfModal>
  <div class="flex justify-center">
    <div class="min-w-[40%]">
      <OpTable
          :data="data"
          :pagination="pagination"
          row-key-field="_id"
          @sort="handleUpdateFilters"
          @pageChange="handlePageChange"
          @search="handleUpdateFilters"
      >
        <OpTableCol header="Nom" property="name" sortable searchable />
        <OpTableCol header="Valeur" property="value" sortable />
        <OpTableCol header="Date d'expiration" property="expirationDate" sortable>
          <template #default="row">
            {{ new Date(row.value).toLocaleDateString('fr-FR') }}
          </template>
        </OpTableCol>
        <OpTableCol header="Actions">
          <template #default="row">
            <OpTableActions :row="row" :data="data" :editMethod="() => openPromotionFormModal(row.value._id)" :deleteMethod="deletePromotion" />
          </template>
        </OpTableCol>
      </OpTable>
    </div>

  </div>

</template>

