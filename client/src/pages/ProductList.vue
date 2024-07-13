<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProducts } from '@/api/product.api';
import FilterBuilder from '@/utils/filter.util';
import { debounce } from '@/utils/debounce.utils';
import ProductCard from '@/components/ProductCard.vue';
import Pagination from '@/components/ui/Pagination.vue';
import {usePagination} from "@/composables/usePagination.ts";
import {useAlertStore} from "@/stores/alerts.store.ts";

const router = useRouter();
const route = useRoute();

const products = ref([]);
const searchQuery = ref('');
const queryString = ref('');
const alertStore = useAlertStore();
const {pagination, setPagination} = usePagination();
let filterBuilder = new FilterBuilder();

const fetchProducts = async () => {
  if(queryString.value.length <= 0) {
    queryString.value = filterBuilder.build() + `&page=${pagination.currentPage}`;
  }
  try {
    const response = await getProducts(queryString.value);
    products.value = response.data;
    setPagination(response.pagination);
  } catch (error) {
    alertStore.showAlert("Impossible de charger les produits", "negative");
  }
  updateUrlParams(queryString.value);
};

const handleSearch = debounce(() => {
  pagination.currentPage = 1;
  filterBuilder = new FilterBuilder();
  queryString.value = '';
  if(searchQuery.value.length > 0){
    filterBuilder
        .add('name').contains(searchQuery.value).logic('OR').ord('ASC')
        .add('description').contains(searchQuery.value).logic('OR');
  }
  fetchProducts();
}, 300);

const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  queryString.value = '';
  fetchProducts();
};


const updateUrlParams = (query: string) => {
  const params = new URLSearchParams(query);
  router.replace({ query: Object.fromEntries(params.entries()) });
};

onMounted(() => {
  if (route.query) {
    const params = new URLSearchParams(route.query as Record<string, string>);
    queryString.value = params.toString();
    pagination.currentPage = Number(params.get('page')) || 1;
  }
  fetchProducts();
});

watch(() => route.query, () => {

  fetchProducts();

});

</script>

<template>
  <div>
    <input
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Rechercher des produits..."
        @focus="goToProducts"
    />
    <div class="flex justify-center">
      <div v-if="products.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-32">
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
      <div v-else>
        Il n'y a pas de produit
      </div>
    </div>

  </div>
</template>
