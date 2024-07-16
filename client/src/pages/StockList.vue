<script setup lang="ts">
import { useClientLayoutStore } from "@/stores/client-layout.store.ts";
import { getStocks } from "@/api/stock.api.ts";
import { usePagination } from "@/composables/usePagination.ts";
import Pagination from "@/components/ui/Pagination.vue";
import { onMounted, ref } from "vue";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { UPLOAD_PATH } from "../../config/global.ts";
import { errorImage } from "@/utils/image.util.ts";

const clientLayoutStore = useClientLayoutStore();
const alertStore = useAlertStore();
const { setPagination, pagination } = usePagination();
clientLayoutStore.pageTitle = 'Liste des stocks';

const stocks = ref([]);
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  fetchStocks();
};
const fetchStocks = async () => {
  const response = await getStocks('page=' + pagination.currentPage);
  if (!response) {
    alertStore.showAlert("Impossible de charger les stocks", "negative");
    return;
  }
  stocks.value = response.data;
  setPagination(response.pagination);
};
onMounted(async () => {
  await fetchStocks();
});
</script>

<template>
  <div class="flex w-full justify-center my-6">
    <div class="w-3/4">
      <div class="flex flex-wrap gap-10">
          <template v-for="stock in stocks" :key="stock._id">
          <router-link :to="'/stock/'+stock.slug+'/products'">
            <div class="flex flex-col">
              <img
                  class="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
                  :src="UPLOAD_PATH + '/' + stock.product.imageName"
                  @error="errorImage"
                  width="150px"
                  height="150px"
              />
              <h3 class="text-center text-lg font-semibold mt-2">{{ stock.product.name }}</h3>
              <p class="text-center">{{ stock.quantity }} en stock</p>
              <p class="text-center">{{ stock.location }}</p>
            </div>
          </router-link>
          </template>
      </div>
      <div class="flex justify-center">
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
  </div>
</template>

<style scoped>
</style>
