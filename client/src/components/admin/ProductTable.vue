<script setup lang="ts">
import OpTable from '@/components/ui/OpTable.vue';
import OpTableCol from '@/components/ui/OpTableCol.vue';
import { deleteProduct } from '@/api/admin/product.api';
import { getProducts } from '@/api/product.api';
import { useTable } from '@/composables/useTable';
import OpTableActions from "@/components/ui/OpTableActions.vue";
import { UPLOAD_PATH } from "@/../config/global.ts";
import { errorImage } from "@/utils/image.util.ts";
import {computed, ref} from "vue";
import ProductForm from "@/components/admin/ProductForm.vue";
import { SfButton, SfIconClose, SfModal, useDisclosure } from "@storefront-ui/vue";
import {toFrenchDate} from "../../utils/date.util.ts";

const { isOpen, open, close } = useDisclosure({ initialValue: false });

const {
  data,
  pagination,
  handlePageChange,
  handleUpdateFilters,
  fetchTableData
} = useTable({
  fetchData: getProducts,
});

const productFormModalId = ref<number>();

const openProductFormModal = (id: number) => {
  productFormModalId.value = id;
  open();
}
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};
</script>

<template>
  <SfButton @click="openProductFormModal(null)" class="mb-4" variant="primary">
    Ajouter un produit
  </SfButton>

  <SfModal class="z-10 fixed flex justify-center w-10/12 md:w-4/12 animate-fade max-md:max-h-[90%] md:max-h-screen max-sm:w-[90%] overflow-auto" v-model="isOpen">
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
      <SfIconClose />
    </SfButton>
    <ProductForm @success="fetchTableData" :id="productFormModalId"/>
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
      <OpTableCol header="Marque" property="brand" sortable searchable />
      <OpTableCol header="Prix" property="price" sortable>
        <template #default="row">
          {{ computed(() => formatPrice(row.value)).value }}
        </template>
      </OpTableCol>
      <OpTableCol header="Prix réduit" property="discountedPrice" sortable>
        <template #default="row">
          {{ computed(() => formatPrice(row.value)).value }}
        </template>
      </OpTableCol>
      <OpTableCol header="Stock" property="stock" sortable />
      <OpTableCol header="Catégorie" property="productCategory">
        <template #default="row">
          {{ row.value.name }}
        </template>
      </OpTableCol>
      <OpTableCol header="Date de création" property="createdAt" sortable>
        <template #default="row">
          {{ toFrenchDate(row.value)}}
        </template>
      </OpTableCol>
      <OpTableCol header="Actions">
        <template #default="row">
          <OpTableActions
              :row="row"
              :data="data"
              :editMethod="() => openProductFormModal(row.value._id)"
              :viewRoute="'/products/' + row.value._id"
              :deleteMethod="deleteProduct"
          />
        </template>
      </OpTableCol>
    </OpTable>
  </div>
</template>