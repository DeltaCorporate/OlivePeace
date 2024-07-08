<template>
  <div class="cart mx-auto p-4">
    <div class="cart-header mb-4">
      <h1 class="text-2xl font-bold">{{ orderSummary.title }}</h1>
      <p class="text-lg text-gray-600">{{ orderSummary.subTitle }}</p>
    </div>
    <div class="cart-items grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="item in orderSummary.items" :key="item._id" class="cart-item bg-white shadow-md rounded-lg p-4">
        <img :src="item.image" :alt="item.title" class="cart-item-image rounded-lg mb-4 w-24 h-24" />
        <div class="cart-item-details">
          <h2 class="text-xl font-semibold mb-2">{{ item.title }}</h2>
          <p class="text-lg text-gray-800 mb-2">{{ formatPrice(item.price) }}</p>
          <p class="text-md text-gray-600 mb-4">Quantity: {{ item.qty }}</p>
          <SfInput
              v-model="item.qty"
              type="number"
              min="1"
              class="w-full mb-2"
              @change="updateQuantity(item)"
          />
          <SfButton variant="secondary" class="w-full" @click="removeItem(item._id)">Retirer</SfButton>
        </div>
      </div>
    </div>
    <div class="cart-summary mt-8 p-4 bg-gray-100 rounded-lg text-right">
      <p class="text-lg font-bold mb-4">Total: {{ formatPrice(orderSummary.total) }}</p>
      <SfButton variant="primary" size="lg" class="w-full" @click="placeOrder">Commander</SfButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { SfButton, SfInput } from '@storefront-ui/vue';

const orderSummary = ref({
  title: 'Mon Panier',
  subTitle: 'Produits sélectionnés',
  total: 0,
  items: [
    {
      _id: '1',
      image: 'https://via.placeholder.com/150',
      title: 'Produit 1',
      price: 50.00,
      qty: 2,
    },
    {
      _id: '2',
      image: 'https://via.placeholder.com/150',
      title: 'Produit 2',
      price: 30.00,
      qty: 1,
    },
    {
      _id: '3',
      image: 'https://via.placeholder.com/150',
      title: 'Produit 3',
      price: 80.00,
      qty: 2,
    }
    // Ajoutez d'autres produits ici
  ],
});

onMounted(() => {
  updateTotal();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

const updateQuantity = (item) => {
  item.totalPrice = item.price * item.qty;
  updateTotal();
};

const removeItem = (id) => {
  orderSummary.value.items = orderSummary.value.items.filter(item => item._id !== id);
  updateTotal();
};

const updateTotal = () => {
  orderSummary.value.total = orderSummary.value.items.reduce((acc, item) => acc + item.price * item.qty, 0);
};

const placeOrder = () => {
  alert('Commande validée !');
};
</script>

<style scoped>
.cart {
  max-width: 1200px;
}
.cart-header {
  margin-bottom: 20px;
}
.cart-items {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.cart-item {
  display: flex;
  gap: 20px;
}
.cart-item-image {
  width: 50%;
  height: auto;
  object-fit: cover;
}
.cart-item-details {
  display: flex;
  flex-direction: column;
}
.cart-summary {
  margin-top: 20px;
  text-align: right;
}
</style>
