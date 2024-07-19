<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { deleteCommand } from '@/api/admin/command.api';
import { getCommands } from "@/api/command.api";
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { onMounted, ref } from "vue";
import OrderForm from "@/components/admin/CommandForm.vue";
import { SfButton, SfIconClose, SfModal, useDisclosure } from "@storefront-ui/vue";

const { isOpen, open, close } = useDisclosure({ initialValue: false });

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
    fetchTableData,
} = useTable({
  fetchData: getCommands,
});

const commandFormModalId = ref<number>();
const openOrderFormModal = (id: number) => {
  commandFormModalId.value = id;
  open();
}

</script>

<template class="relative">
  <SfButton @click="openOrderFormModal(null)" class="mb-4" variant="primary">
    Ajouter une commande
  </SfButton>
  <div v-if="isOpen" class="fixed inset-0 z-10 bg-neutral-700 bg-opacity-50" />
  <SfModal class="z-10 absolute animate-fade md:max-w-[60%]" v-model="isOpen">
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
      <SfIconClose />
    </SfButton>
    <OrderForm
        @success="fetchTableData"
        :id="commandFormModalId"
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
        <OpTableCol header="Utilisateur" property="userId" sortable searchable />
        <OpTableCol header="Montant Total" property="totalAmount" sortable searchable />
        <OpTableCol header="Statut" property="status" sortable searchable />
        <OpTableCol header="Date de création" property="createdAt" sortable>
          <template #default="row">
            {{ new Date(row.value.createdAt).toLocaleDateString('fr-FR') }}
          </template>
        </OpTableCol>
        <OpTableCol header="Actions">
          <template #default="row">
            <OpTableActions :row="row" :data="data" :editMethod="() => openOrderFormModal(row.value._id)" :deleteMethod="deleteCommand" />
          </template>
        </OpTableCol>
      </OpTable>
    </div>
  </div>
</template>

<style scoped>
</style>
