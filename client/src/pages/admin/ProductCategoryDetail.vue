<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-row items-start">
      <img :src="UPLOAD_PATH + '/' + category.imageName" class="w-40 h-40 object-cover rounded-full mr-4" />
      <div class="flex flex-col">
        <h1 class="typography-headline-1">{{ category.name }}</h1>
        <p class="typography-text-base">{{ category.description }}</p>
        <p class="text-sm text-gray-500">{{ formattedDate }}</p>
        <p class="text-sm text-gray-500">{{ category._id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductCategoryBySlug } from '@/api/admin/product-category.api.ts';
import { toFrenchDate } from '@/utils/date.util';
import { UPLOAD_PATH } from "@/../config/global.ts";
import {useAdminLayoutStore} from "@/stores/admin/admin-layout.store.ts";

const route = useRoute();
const category = ref(null);
const formattedDate = ref('');

const adminLayoutStore = useAdminLayoutStore();

const fetchCategory = async () => {
  const response = await getProductCategoryById(route.params.id);
  category.value = response.data;
  formattedDate.value = toFrenchDate(category.value.createdAt);
  adminLayoutStore.setPageTitle(`Détails de ${category.value.name}`);
};

onMounted(fetchCategory);
</script>

<style scoped>
.container {
  max-width: 800px;
}
.typography-headline-1 {
  font-size: 2rem;
  font-weight: bold;
}
.typography-text-base {
  font-size: 1rem;
}
</style>
