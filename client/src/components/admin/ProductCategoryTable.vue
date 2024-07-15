<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import {deleteProductCategory } from '@/api/admin/product-category.api';
import {getProductCategories } from '@/api/product-category.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { UPLOAD_PATH } from "@/../config/global.ts";
import {errorImage} from "@/utils/image.util.ts";
import {ref} from "vue";

import ProductCategoryForm from "@/components/admin/ProductCategoryForm.vue";
import {SfButton, SfIconClose, SfModal, useDisclosure} from "@storefront-ui/vue";
const { isOpen, open, close } = useDisclosure({ initialValue: false });

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
} = useTable({
  fetchData: getProductCategories,

});

const productCategoryFormModalId = ref<number>();
const openProductCategoryFormModal = (id: number) => {
  productCategoryFormModalId.value = id;
  open();
}
</script>

<template>
  <SfModal class="z-10 absolute  animate-fade md:max-w-[60%]" v-model="isOpen">
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
      <SfIconClose />
    </SfButton>
      <ProductCategoryForm />
  </SfModal>
  <div class="w-full overflow-auto">
    <OpTable
        :data="data"
        :pagination="pagination"
        row-key-field="_id"
        @sort="handleUpdateFilters"
        @pageChange="handlePageChange"
        @search="handleUpdateFilters"
    >
      <OpTableCol header="">
        <template #default="row">
          <div class="w-16 object-cover aspect-square">
            <img @error="errorImage" :src="UPLOAD_PATH + '/' + row.value.imageName" class="w-16 object-cover aspect-square rounded-full" />

          </div>
        </template>
      </OpTableCol>
      <OpTableCol header="Nom" property="name" sortable searchable />
      <OpTableCol header="Description" property="description" sortable searchable />
      <OpTableCol header="Slug" property="slug"/>
      <OpTableCol header="Date de création" property="createdAt" sortable>
        <template #default="row">
          {{ new Date(row.value).toLocaleDateString() }}
        </template>
      </OpTableCol>
      <OpTableCol header="Actions">
        <template #default="row">
          <OpTableActions :row="row" :data="data" :editMethod="() => openProductCategoryFormModal(row.value._id)" :viewRoute="'/admin/product_categories/view/'+row.value._id" :deleteMethod="deleteProductCategory" />
        </template>
      </OpTableCol>
    </OpTable>
  </div>

</template>

<style scoped>
</style>
