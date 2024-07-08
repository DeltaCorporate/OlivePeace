<script setup>
import { ref } from 'vue';
import SfOrderSummary from "@/components/ui/SfOrderSummary.vue";

const orderSummary = ref({
  // Exemple, données à modifier
  title: 'Mon Panier',
  subTitle: 'Sous-titre du panier',
  total: '100,00 €',
  items: [
    {
      _id: '1',
      image: 'path/to/image.jpg',
      title: 'Produit 1',
      price: '50,00 €',
      qty: 2,
    },
    // Ajoutez d'autres produits ici
  ],
});
</script>

<template>
  <div class="cart">
    <SfOrderSummary
        :title="orderSummary.title"
        :subTitle="orderSummary.subTitle"
        :total="orderSummary.total"
        :items="orderSummary.items"
    />
  </div>
</template>

<style scoped>
.cart {
  padding: 20px;
}
</style>
