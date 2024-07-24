<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getOrder } from '@/api/order.api.ts';
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import {
  SfButton,
  SfIconShoppingCart,
  SfIconPackage,
  SfIconCheck,
  SfIconCreditCard,
  SfBadge,
  SfAccordionItem,
  SfIconCalendarToday
} from '@storefront-ui/vue';
import { useAlertStore } from '@/stores/alerts.store';
import { useTable } from '@/composables/useTable';

const route = useRoute();
const alertStore = useAlertStore();
const order = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const fetchOrder = async () => {
  const response = await getOrder(route.params.id);
  if (response.isSuccess) {
    order.value = response.data;
  } else {
    alertStore.showAlert('Erreur lors de la récupération de la commande', 'negative');
  }
};

const proceedToPayment = () => {
  alertStore.showAlert('Redirection vers la page de paiement...', 'info');
};

const fetchOrderDetails = async (params) => {
  await fetchOrder();
  return {
    data: order.value?.orderDetails || [],
    pagination: {
      totalItems: order.value?.orderDetails?.length || 0,
      totalPages: 1,
      currentPage: 1,
      limit: order.value?.orderDetails?.length || 10
    }
  };
};

const {
  data: orderDetails,
  pagination,
  handlePageChange,
  handleUpdateFilters,
  fetchTableData
} = useTable({
  fetchData: fetchOrderDetails,
});

const statusInfo = computed(() => {
  const statuses = {
    'processing': { color: 'warning', icon: SfIconShoppingCart, text: 'En cours de traitement' },
    'shipped': { color: 'info', icon: SfIconPackage, text: 'Expédié' },
    'delivered': { color: 'positive', icon: SfIconCheck, text: 'Livré' },
  };
  return statuses[order.value?.deliveryStatus] || { color: 'neutral', icon: null, text: 'Inconnu' };
});

onMounted(fetchTableData);
</script>

<template>
  <div v-if="order" class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Commande #{{ order._id }}</h1>
      <SfBadge :class="`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`">
        <component :is="statusInfo.icon" class="mr-2" />
        {{ statusInfo.text }}
      </SfBadge>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-gray-50 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Détails de la commande</h2>
        <p class="flex items-center"><SfIconCalendarToday class="mr-2" /> Date : {{ formatDate(order.createdAt) }}</p>
        <p class="flex items-center"><SfIconCreditCard class="mr-2" /> Total : {{ formatPrice(order.price) }}</p>
      </div>
      <div class="bg-gray-50 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Statut du paiement</h2>
        <p v-if="order.isPaid" class="text-green-600">Payé</p>
        <div v-else>
          <p class="text-red-600 mb-2">Non payé</p>
          <SfButton @click="proceedToPayment" class="w-full">Procéder au paiement avec stripe</SfButton>
        </div>
        <p v-if="order.paymentFailedMessage" class="text-red-600 mt-2">
          Échec du paiement : {{ order.paymentFailedMessage }}
        </p>
      </div>
    </div>


          <span class="text-lg font-semibold">Détails des articles</span>
          <OpTable
              :data="orderDetails"
              :pagination="pagination"
              row-key-field="_id"
              @pageChange="handlePageChange"
              @sort="handleUpdateFilters"
              @search="handleUpdateFilters"
              class="w-full"
          >
            <OpTableCol header="Produit" property="productName"/>
            <OpTableCol header="Quantité" property="quantity"/>
            <OpTableCol header="Prix" property="price">
              <template #default="{ value }">{{ formatPrice(value) }}</template>
            </OpTableCol>
          </OpTable>

  </div>
</template>