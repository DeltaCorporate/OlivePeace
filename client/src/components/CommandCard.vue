<script setup lang="ts">
import { defineProps } from 'vue';
import { CommandType } from '@/types/command.type.ts';

const props = defineProps<{
  order: CommandType;
}>();
</script>

<template>
  <div class="border p-4 rounded-lg shadow-sm">
    <h3 class="text-lg font-semibold">Commande #{{ order.id }}</h3>
    <p><strong>Montant Total:</strong> {{ order.details.reduce((total, detail) => total + detail.price * detail.quantity, 0) }} €</p>
    <p><strong>Statut:</strong> {{ order.deliveryStatus }}</p>
    <p><strong>Date de Création:</strong> {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
    <router-link :to="'/orders/view/' + order.id" class="text-primary-600 hover:text-primary-700">
      Voir les détails
    </router-link>
  </div>
</template>

<style scoped>
</style>
