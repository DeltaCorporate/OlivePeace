<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const orders = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

onMounted(async () => {
  try {
    const response = await store.dispatch('order/fetchUserOrders');
    orders.value = response;
  } catch (err) {
    error.value = 'Erreur lors du chargement des commandes';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="orders mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Vos Commandes</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <div v-for="order in orders" :key="order._id" class="order bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold mb-2">Commande {{ order._id }}</h2>
        <p class="text-lg text-gray-800 mb-2">Total: {{ formatPrice(order.total) }}</p>
        <ul class="list-disc list-inside">
          <li v-for="item in order.items" :key="item.productId._id" class="mb-2">
            <span>{{ item.productId.name }} - Quantité: {{ item.quantity }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders {
  max-width: 1200px;
}
</style>
