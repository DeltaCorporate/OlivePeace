<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCommandsByUserId } from '@/api/command.api';
import FilterBuilder from '@/utils/filter.util';
import OrderCard from '@/components/CommandCard.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { usePagination } from "@/composables/usePagination.ts";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { useOrderSearchStore } from '@/stores/orderSearch.store';
import { CommandType } from "@/types/command.type.ts";
import { useClientLayoutStore } from "@/stores/client-layout.store.ts";
import { isEmpty } from "@/utils/divers.util.ts";

const router = useRouter();
const route = useRoute();
const orders = ref<CommandType[]>([]);
const queryString = ref('');
const alertStore = useAlertStore();
const searchStore = useOrderSearchStore();
const clientLayoutStore = useClientLayoutStore();
const { pagination, setPagination } = usePagination();

const fetchOrders = async () => {
  const filterBuilder = new FilterBuilder();
  filterBuilder.filters = { ...searchStore.filterBuilder.filters };

  if (queryString.value.length <= 0) {
    queryString.value = filterBuilder.build() + `&page=${pagination.currentPage}`;
  }

  try {
    const response = await getCommandsByUserId(Number(route.params.userId), queryString.value);
    orders.value = response.data;
    setPagination(response.pagination);
  } catch (error) {
    alertStore.showAlert("Impossible de charger les commandes", "negative");
  }
  updateUrlParams(queryString.value);
};

const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  queryString.value = '';
  fetchOrders();
};

const updateUrlParams = (query: string) => {
  const params = new URLSearchParams(query);
  router.replace({ query: Object.fromEntries(params.entries()) });
};

onMounted(async () => {
  if (route.query) {
    const params = new URLSearchParams(route.query as Record<string, string>);
    queryString.value = params.toString();
    pagination.currentPage = Number(params.get('page')) || 1;

    clientLayoutStore.setPageTitle('Historique des commandes');
  }
  await fetchOrders();
});

watch(searchStore.filterBuilder, () => {
  pagination.currentPage = 1;
  queryString.value = '';
  fetchOrders();
});
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex justify-center">
      <div v-if="orders.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-32">
          <OrderCard v-for="order in orders" :key="order.id" :order="order" />
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
      <div v-else>Il n'y a pas de commandes</div>
    </div>
  </div>
</template>

<style scoped>
</style>
