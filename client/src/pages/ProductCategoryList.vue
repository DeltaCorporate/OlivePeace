<script setup lang="ts">
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";
import {getProductCategories} from "@/api/product-category.api.ts";
import {usePagination} from "@/composables/usePagination.ts";
import Pagination from "@/components/ui/Pagination.vue";
import {onMounted, ref} from "vue";
import {useAlertStore} from "@/stores/alerts.store.ts";
import {UPLOAD_PATH} from "../../config/global.ts";
import {errorImage} from "@/utils/image.util.ts";

const clientLayoutStore = useClientLayoutStore();
const alertStore = useAlertStore();
const {setPagination,pagination} = usePagination();
clientLayoutStore.pageTitle = 'Liste des catégories de produits';


const productCategories = ref([]);
const handlePageChange = (page: number) => {
    pagination.currentPage = page;
    fetchProductCategories();
};
const fetchProductCategories = async () => {
    const response = await getProductCategories('page='+pagination.currentPage);
    if(!response){
      alertStore.showAlert("Impossible de charger les catégories de produits", "negative");
      return;
    }
    productCategories.value = response.data;
    setPagination(response.pagination);
};
onMounted(async () => {
    await fetchProductCategories();
});
</script>

<template>
  <div class="flex w-full justify-center my-6">
    <div class="w-3/4">
      <div class="flex flex-wrap gap-10">

        <template v-for="productCategory in productCategories" :key="productCategory._id">
        <router-link :to="'/product_categories/'+productCategory.slug+'/products'">
          <div class="flex flex-col">
            <img
                class="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
                :src="UPLOAD_PATH + '/'+productCategory.imageName"
                @error="errorImage"
                width="150px"
                height="150px"
            />
            <h3 class="text-center text-lg font-semibold mt-2">{{ productCategory.name }}</h3>
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