

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {getProductCategory} from '@/api/admin/product-category.api';
import {toFrenchDate} from '@/utils/date.util';
import {UNDEFINED_DEFAULT_IMG, UPLOAD_PATH} from "@/../config/global.ts";
import {useAdminLayoutStore} from '@/stores/admin/admin-layout.store.ts';
import {ProductCategoryType} from "@/types/product-category.type.ts";
import Return2Back from "@/components/ui/Return2Back.vue";
import {errorImage} from "@/utils/image.util.ts";

const route = useRoute();
const category = ref<ProductCategoryType>({});
const adminLayoutStore = useAdminLayoutStore();

const formattedCreatedAt = computed(() => {
  return toFrenchDate(category.value.createdAt);
});
const fetchProductCategory = async () => {
  const response = await getProductCategory(route.params.slug);
  category.value = response.data;

};

onMounted( () => {
  adminLayoutStore.setPageTitle('Détail de la catégorie');
  fetchProductCategory();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-row items-start gap-5">
      <div class="w-52">
        <img @error="errorImage" :src="UPLOAD_PATH + '/' + category.imageName" class="w-full aspect-square h-full object-cover rounded-full" />
      </div>
      <div class="flex flex-col p-2 w-full">
        <h1 class="typography-headline-2">{{ category.name }}</h1>
        <p class="text-base">{{ category.description }}</p>
        <p class="text-base">Promotion appliquée : {{ category.promotionId }}</p>
        <p class="text-sm text-right text-neutral-500">{{ formattedCreatedAt }}</p>
      </div>
    </div>
  </div>
</template>