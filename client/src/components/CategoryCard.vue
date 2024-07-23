<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { UPLOAD_PATH } from '@/../config/global';
import { errorImage } from '@/utils/image.util';

defineProps({
  category: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <div class="category-card">
    <img :src="UPLOAD_PATH + '/' + category.imageName" :alt="category.name" class="w-full rounded-md shadow-md h-48 object-cover mb-2" @error="errorImage">
    <h3 class="font-semibold text-lg text-center">{{ category.name }}</h3>
    <SfButton size="sm" class="mt-2 w-full" @click="$router.push(`/product_categories/${category.slug}/products`)">Voir les produits</SfButton>
  </div>
</template>



