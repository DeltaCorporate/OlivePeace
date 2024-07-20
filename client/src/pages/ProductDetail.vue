<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getProduct } from '@/api/product.api';
import { useAlertStore } from '@/stores/alerts.store';
import { UPLOAD_PATH } from '@/../config/global';
import { errorImage } from '@/utils/image.util';
import { SfBadge, SfButton, SfLink, SfIconShoppingCart, SfLoaderCircular } from '@storefront-ui/vue';
import { useClientLayoutStore } from '@/stores/client-layout.store';
import {pickError} from "@/utils/response.util.ts";

const route = useRoute();
const alertStore = useAlertStore();
const clientLayoutStore = useClientLayoutStore();

const product = ref(null);
const loading = ref(true);

const formattedPrice = computed(() => {
  if (!product.value) return '';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.value.price);
});

const discountedPrice = computed(() => {
  if (!product.value || !product.value.discountedPrice) return '';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.value.discountedPrice);
});

onMounted(async () => {
  const slug = route.params.slug as string;
    const response = await getProduct(slug);
    if (response.isSuccess) {
      product.value = response.data;
      clientLayoutStore.setPageTitle(product.value.name);
    } else
      alertStore.showAlert(pickError(response.errors)?.message ?? "Impossible de charger le produit", "negative");

    loading.value = false;

});
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <SfLoaderCircular size="3xl" />
  </div>
  <div v-else-if="product" class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row -mx-4">
      <div class="md:flex-1 px-4">
        <div class="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
          <img
              :src="UPLOAD_PATH + '/' + product.imageName"
              @error="errorImage"
              :alt="product.name"
              class="h-full w-full object-cover rounded-lg"
          />
        </div>
      </div>
      <div class="md:flex-1 px-4">
        <h2 class="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{{ product.name }}</h2>
        <p class="text-gray-500 text-sm">Par <a href="#" class="text-secondary-600 hover:underline">{{ product.brand }}</a></p>

        <div class="flex items-center space-x-4 my-4">
          <div>
            <div class="rounded-lg bg-gray-100 flex gap-5 py-2 px-3">
              <span v-if="product.price == product.discountedPrice">
                <span class="font-bold text-primary-600 text-3xl">{{ formattedPrice }}</span>
              </span>
              <span v-else>
                <span class="font-bold text-secondary-600 text-3xl">{{ discountedPrice }}</span>
                <span class="font-bold text-primary-300 text-2xl line-through">{{ formattedPrice }}</span>
              </span>

            </div>
          </div>
          <div class="flex-1">
            <p class="text-green-500 text-xl font-semibold">En stock</p>
            <p class="text-gray-400 text-sm">Quantité disponible : {{ product.stock }}</p>
          </div>
        </div>

        <p class="text-gray-500">{{ product.description }}</p>

        <div class="flex py-4 space-x-4">
          <SfButton class="w-full md:w-auto" size="lg">
            <template #prefix>
              <SfIconShoppingCart />
            </template>
            Ajouter au panier
          </SfButton>
        </div>

        <div class="flex items-center space-x-2">
          <SfBadge>{{ product.ProductCategory.name }}</SfBadge>
          <SfBadge v-if="product.Promotion" color="secondary">Promotion: {{ product.Promotion.name }}</SfBadge>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-8">
    Produit non trouvé
  </div>
</template>