<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrder } from '@/api/command.api';
import { useRoute } from 'vue-router';
import { CommandType } from '@/types/command.type';
import { useAlertStore } from '@/stores/alerts.store';

const order = ref<CommandType | null>(null);
const route = useRoute();
const alertStore = useAlertStore();

const fetchOrder = async () => {
  const { id } = route.params;
  try {
    const response = await getOrder(Number(id));
    if (response.isSuccess) {
      order.value = response.data;
    } else {
      alertStore.showAlert('Erreur lors du chargement de la commande', 'negative');
    }
  } catch (error) {
    alertStore.showAlert('Erreur lors du chargement de la commande', 'negative');
  }
};

onMounted(() => {
  fetchOrder();
});
</script>

<template>
  <div v-if="order">
    <h1>Commande #{{ order.id }}</h1>
    <p><strong>Utilisateur:</strong> {{ order.userId }}</p>
    <p><strong>Montant Total:</strong> {{ order.totalAmount }} €</p>
    <p><strong>Statut:</strong> {{ order.status }}</p>
    <p><strong>Date de Création:</strong> {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>

    <h2>Articles de la Commande</h2>
    <ul>
      <li v-for="item in order.items" :key="item.id">
        <p><strong>Produit ID:</strong> {{ item.productId }}</p>
        <p><strong>Quantité:</strong> {{ item.quantity }}</p>
        <p><strong>Prix:</strong> {{ item.price }} €</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
