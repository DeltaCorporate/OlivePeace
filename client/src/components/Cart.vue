<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SfButton, SfInput, SfModal, useDisclosure } from '@storefront-ui/vue';
import Return2Back from "@/components/ui/Return2Back.vue";
import { useCartStore } from '@/stores/cart.store';

const cartStore = useCartStore();
const { isOpen, open, close } = useDisclosure({ initialValue: false });

const orderSummary = ref({
  title: 'Votre panier',
  subTitle: 'Produits sélectionnés',
  total: 0,
  items: [],
});
const loading = ref(true);
const error = ref<string | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const updateQuantity = (item: any) => {
  cartStore.updateCartItem({ productId: item._id, quantity: item.qty });
  item.totalPrice = item.price * item.qty;
  updateTotal();
};

const removeItem = (id: string) => {
  cartStore.removeFromCart(id);
  orderSummary.value.items = orderSummary.value.items.filter(item => item._id !== id);
  updateTotal();
};

const updateTotal = () => {
  orderSummary.value.total = orderSummary.value.items.reduce((acc, item) => acc + item.price * item.qty, 0);
};

const placeOrder = async () => {
  try {
    await cartStore.placeOrder();
    alert('Commande passée !');
  } catch (err) {
    error.value = 'Erreur lors de la validation de la commande';
  }
};

onMounted(async () => {
  try {
    await cartStore.fetchCart();
    orderSummary.value.items = cartStore.items.map((item: any) => ({
      _id: item.product._id,
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
      <SfButton variant="primary" size="lg" class="w-full" @click="open">Commander</SfButton>
    </div>
    <SfModal v-if="isOpen" class="z-10 absolute animate-fade md:max-w-[60%]" v-model="isOpen">
      <div class="p-4">
        <div class="p-4 text-center">
          <h2 class="text-2xl font-bold mb-4">Confirmer la Commande</h2>
          <p class="mb-4">Voulez-vous vraiment passer la commande ?</p>
          <router-link to="/" class="router-link-button">
            <SfButton variant="primary" size="lg" class="w-full mb-2" @click="placeOrder">Valider la Commande</SfButton>
          </router-link>
          <SfButton variant="secondary" size="lg" class="w-full" @click="close">Annuler</SfButton>
        </div>
      </div>
    </SfModal>
  </div>
</template>

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
