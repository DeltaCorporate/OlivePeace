

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {getProductCategory} from '@/api/admin/product-category.api';
import {toFrenchDate} from '@/utils/date.util';
import {UPLOAD_PATH} from "@/../config/global.ts";
import {useAdminLayoutStore} from '@/stores/admin/admin-layout.store.ts';
import {ProductCategoryType} from "@/types/product-category.type.ts";
import {errorImage} from "@/utils/image.util.ts";
import {SfButton} from "@storefront-ui/vue";

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

        <div v-if="category.Promotion">
          <router-link :to="`/admin/promotions/${category.Promotion.id}`">
            <SfButton class="relative !rounded-full mt-10" size="sm" variant="primary">
              Promotion : {{ category.Promotion.name }}
            </SfButton>
          </router-link>
        </div>
          <p class="text-sm text-right text-neutral-500">{{ formattedCreatedAt }}</p>
      </div>
    </div>
  </div>
</template>