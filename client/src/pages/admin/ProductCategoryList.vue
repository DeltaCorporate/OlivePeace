<script setup>
import ProductCategoryTable from "@/components/admin/ProductCategoryTable.vue";
import {useAdminLayoutStore} from "@/stores/admin/admin-layout.store.ts";
import {onMounted} from "vue";
const adminLayoutStore = useAdminLayoutStore();

onMounted(() => {
  adminLayoutStore.setPageTitle("Liste des catégories de produits");
});
</script>
<template>
  <ProductCategoryTable />
</template>
<style scoped> </style>