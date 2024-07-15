<script setup lang="ts">
import {ref, onMounted, watch, reactive} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProducts } from '@/api/product.api';
import FilterBuilder from '@/utils/filter.util';
import ProductCard from '@/components/ProductCard.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { usePagination } from "@/composables/usePagination.ts";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { useProductSearchStore } from '@/stores/productSearch.store';
import ProductFilter from "@/components/ProductFilter.vue";
import {ProductCategoryType} from "@/types/product-category.type.ts";
import {getProductCategory, getProductsByCategory} from "@/api/product-category.api.ts";
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";
import {isEmpty} from "@/utils/divers.util.ts";
import {UPLOAD_PATH} from "../../config/global.ts";
import {errorImage} from "@/utils/image.util.ts";

const router = useRouter();
const route = useRoute();
const products = ref([]);
const queryString = ref('');
const productCategory = reactive<ProductCategoryType>({});
const alertStore = useAlertStore();
const searchStore = useProductSearchStore();
const clientLayoutStore = useClientLayoutStore();
const { pagination, setPagination } = usePagination();



const fetchProducts = async () => {
  const filterBuilder = new FilterBuilder();
  filterBuilder.filters = {...searchStore.filterBuilder.filters};

  if (queryString.value.length <= 0)
    queryString.value = filterBuilder.build() + `&page=${pagination.currentPage}`;

  try {
    let response;
    if(route.name === 'product_categories_products'){
      response = await getProductsByCategory({
        params: queryString.value,
        slugOrId: route.params.slug as string
      });
    }else
      response = await getProducts(queryString.value);

    products.value = response.data;
    setPagination(response.pagination);
  } catch (error) {
    alertStore.showAlert("Impossible de charger les produits", "negative");
  }
  updateUrlParams(queryString.value);
};

const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  queryString.value = '';
  fetchProducts();
};

const updateUrlParams = (query: string) => {
  const params = new URLSearchParams(query);
  router.replace({ query: Object.fromEntries(params.entries()) });
};

const fetchProductCategory = async (slug: string) => {
  const response = await getProductCategory(slug);
  if (!response.isSuccess) {
    alertStore.showAlert("Impossible de charger la catégorie de produit", "negative");
    return;
  }
  Object.assign(productCategory, response.data);
};

onMounted(async () => {
  if (route.query) {
    const params = new URLSearchParams(route.query as Record<string, string>);
    queryString.value = params.toString();
    pagination.currentPage = Number(params.get('page')) || 1;

    if(route.name === 'product_categories_products')
      await fetchProductCategory(route.params.slug as string);

    clientLayoutStore.setPageTitle('Liste des produits');
  }
  await fetchProducts();
});


watch(searchStore.filterBuilder, () => {
  pagination.currentPage = 1;
  queryString.value = '';
  fetchProducts();
});
</script>

<template>
  <div class="flex justify-center mb-10" v-if="!isEmpty(productCategory)">
    <div class="bg-neutral-100 rounded-md w-full p-5 flex flex-col items-center">
      <h2 class="typography-headline-2 font-semibold">{{productCategory.name}}</h2>
      <img
          :src="UPLOAD_PATH + '/' + productCategory.imageName"
          @error="errorImage"
          class="block object-cover h-auto rounded-full aspect-square"
          width="150"
          height="150"
      />
      <p>
        {{productCategory.description}}
      </p>
    </div>
  </div>
  <div class="flex flex-col md:flex-row gap-10 md:gap-3">
    <div class="sm:w-full md:w-1/4 md:max-w-[270px]">
      <ProductFilter :filterBuilder="searchStore.filterBuilder" />
    </div>
    <div class="sm:w-full md:w-3/4">
          <div class="flex justify-center">
            <div v-if="products.length > 0">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-32">
                <ProductCard v-for="product in products" :key="product._id" :product="product" />
              </div>
              <div class="w-full flex justify-center my-6">
                <Pagination
                    :totalItems="pagination.totalItems"
                    :totalPages="pagination.totalPages"
                    :currentPage="pagination.currentPage"
                    :pageSize="pagination.pageSize"
                    :limit="pagination.limit"
                    @pageChange="handlePageChange"
                />
              </div>
            </div>
            <div v-else>Il n'y a pas de produit</div>
          </div>
      </div>
  </div>
</template>