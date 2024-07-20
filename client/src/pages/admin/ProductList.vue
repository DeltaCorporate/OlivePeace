<script setup>
import ProductTable from "@/components/admin/ProductTable.vue";
import { useAdminLayoutStore } from "@/stores/admin/admin-layout.store.ts";
import { onMounted } from "vue";

const adminLayoutStore = useAdminLayoutStore();

onMounted(() => {
  adminLayoutStore.setPageTitle("Liste des produits");
});
</script>

<template>
  <div>
    <ProductTable />
  </div>
</template>
