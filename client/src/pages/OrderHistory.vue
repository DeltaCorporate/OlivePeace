<script setup lang="ts">
import { onMounted } from 'vue';
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { useTable } from '@/composables/useTable';
import { getOrders } from '@/api/order.api';
import { useAlertStore } from '@/stores/alerts.store';
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";

const alertStore = useAlertStore();

const {
  data: orders,
  pagination,
  handlePageChange,
  handleUpdateFilters,
  fetchTableData
} = useTable({
  fetchData: getOrders,
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.setPageTitle('Historique des commandes');
onMounted(async () => {
  try {
    await fetchTableData();
  } catch (error) {
    alertStore.showAlert('Erreur lors de la récupération des commandes', 'negative');
  }
});
</script>

<template>
  <div class="order-history">
    <h1 class="text-2xl font-bold mb-4">Historique des commandes</h1>
    <OpTable
        :data="orders"
        :pagination="pagination"
        row-key-field="_id"
        @sort="handleUpdateFilters"
        @pageChange="handlePageChange"
        @search="handleUpdateFilters"
    >
      <OpTableCol header="Numéro de commande" property="_id" sortable searchable>
        <template #default="{ value }">
          <router-link :to="`/orders/${value}`" class="text-primary-600 hover:underline">
            {{ value }}
          </router-link>
        </template>
      </OpTableCol>
      <OpTableCol header="Date" property="createdAt" sortable>
        <template #default="{ value }">
          {{ formatDate(value) }}
        </template>
      </OpTableCol>
      <OpTableCol header="Total" property="price" sortable>
        <template #default="{ value }">
          {{ formatPrice(value) }}
        </template>
      </OpTableCol>
      <OpTableCol header="Statut" property="deliveryStatus" sortable searchable />
      <OpTableCol header="Payée" property="isPaid" sortable>
        <template #default="{ value }">
          {{ value ? 'Oui' : 'Non' }}
        </template>
      </OpTableCol>
    </OpTable>
  </div>
</template>
