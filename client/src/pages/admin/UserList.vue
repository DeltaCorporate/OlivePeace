<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import {SfButton, SfIconClose, SfModal, useDisclosure} from '@storefront-ui/vue';
import { useTable } from '@/composables/useTable';
import { useAlertStore } from "@/stores/alerts.store";
import { getUsers, deleteUser, sendConfirmationEmail } from "@/api/admin/user.api"
import { useAdminLayoutStore } from "@/stores/admin/admin-layout.store";
import UserForm from '@/components/admin/UserForm.vue';
import OpTableActions from "@/components/ui/OpTableActions.vue";

const router = useRouter();
const alertStore = useAlertStore();
const adminLayoutStore = useAdminLayoutStore();
const { isOpen, open, close } = useDisclosure({ initialValue: false });

adminLayoutStore.setPageTitle("Gestion des utilisateurs");

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
  fetchTableData
} = useTable({
  fetchData: getUsers,
});

const selectedUserId = ref<string | null>(null);

const openUserModal = (id: number) => {
  selectedUserId.value = id;
  open();
}



const handleSendConfirmation = async (id: string) => {
  const response = await sendConfirmationEmail(id);
  if (response.isSuccess) {
    alertStore.showAlert('Email de confirmation envoyé', 'positive');
  } else {
    alertStore.showAlert('Erreur lors de l\'envoi de l\'email de confirmation', 'negative');
  }
};

onMounted(async () => { await fetchTableData});
</script>

<template>

  <div>
    <SfModal class="z-10 fixed flex justify-center w-10/12 md:w-4/12 animate-fade" v-model="isOpen">
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </SfButton>
      <UserForm
          :userId="selectedUserId"
          @success="fetchTableData"
      />
    </SfModal>
    <SfButton @click="openUserModal(null)" class="mb-4">Créer un utilisateur</SfButton>
    <OpTable
        :data="data"
        :pagination="pagination"
        row-key-field="_id"
        @sort="handleUpdateFilters"
        @pageChange="handlePageChange"
        @search="handleUpdateFilters"
    >
      <OpTableCol header="Nom" property="lastName" sortable searchable/>
      <OpTableCol header="Email" property="email" sortable searchable />
      <OpTableCol header="Rôles" property="roles"/>
      <OpTableCol header="Confirmé" property="isConfirmed">
        <template #default="{ value }">{{ value ? 'Oui' : 'Non' }}</template>
      </OpTableCol>

      <OpTableCol header="Actions">
        <template #default="row">
          <OpTableActions
              :row="row"
              :data="data"
              :editMethod="() => openUserModal(row.value._id)"
              :deleteMethod="deleteUser"
          />
          <SfButton @click="handleSendConfirmation(row.value._id)" v-if="!row.value.isConfirmed" variant="secondary">Confirmer Email</SfButton>
        </template>
      </OpTableCol>
    </OpTable>


  </div>
</template>