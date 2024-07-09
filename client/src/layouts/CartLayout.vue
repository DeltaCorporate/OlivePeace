<template>
  <div class="cart mx-auto p-4">
    <Return2Back class="bottom-5 left-5 absolute rtn-btn"/>
    <div class="cart-header mb-4">
      <h1 class="text-2xl font-bold">{{ orderSummary.title }}</h1>
      <p class="text-lg text-gray-600">{{ orderSummary.subTitle }}</p>
    </div>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div class="cart-items grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in orderSummary.items" :key="item._id" class="cart-item bg-white shadow-md rounded-lg p-4">
        <img :src="item.image" :alt="item.title" class="cart-item-image rounded-lg mb-4 mx-auto" />
        <div class="cart-item-details">
          <h2 class="text-xl font-semibold mb-2 truncate">{{ item.title }}</h2>
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
    <SfModal v-if="isOpen" @close="closeModal = false">
      <template #overlay>
        <div class="fixed inset-0 bg-black opacity-50"></div>
      </template>
      <template #content>
        <div class="bg-white rounded-lg p-8 max-w-lg mx-auto">
          <h2 class="text-xl font-semibold mb-4">Confirmation de la commande</h2>
          <p class="mb-4">Votre commande a été validée avec succès !</p>
          <SfButton variant="primary" size="lg" class="w-full" @click="closeModal">OK</SfButton>
        </div>
      </template>
    </SfModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {SfButton, SfInput, useDisclosure} from '@storefront-ui/vue';
import { fetchCart } from '@/api/cart.api.ts';
import Return2Back from "@/components/ui/Return2Back.vue";
import SfModal from "@/components/ui/SfModal.vue";

const orderSummary = ref({
  title: 'Mon Panier',
  subTitle: 'Produits sélectionnés',
  total: 0,
  items: [],
});
const loading = ref(true);
const error = ref(null);
const { isOpen, open, close } = useDisclosure({ initialValue: false });

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
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
  open();
};

const closeModal = () => {
  close();
};

onMounted(async () => {
  try {
    const cartData = await fetchCart(userId);
    orderSummary.value.items = cartData.items.map(item => ({
      _id: item.product.id,
      image: item.product.image,
      title: item.product.name,
      price: item.product.price,
      qty: item.quantity
    }));
    updateTotal();
  } catch (err) {
    error.value = 'Erreur lors du chargement des données panier';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.rtn-btn {
  color: black;
}

.cart {
  max-width: 1200px;
}
.cart-header {
  margin-bottom: 20px;
}
.cart-items {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}
.cart-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}
.cart-item-image {
  width: 100%;
  height: 50%;
  object-fit: cover;
  margin: auto;
}
.cart-item-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
h2.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cart-summary {
  margin-top: 20px;
  text-align: right;
}
</style>
