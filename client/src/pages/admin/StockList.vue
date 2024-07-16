<script setup>
import StockTable from "@/components/admin/StockTable.vue";
import { useAdminLayoutStore } from "@/stores/admin/admin-layout.store.ts";
import { onMounted } from "vue";

const adminLayoutStore = useAdminLayoutStore();

onMounted(() => {
  adminLayoutStore.setPageTitle("Liste des stocks");
});
</script>

<template>
  <StockTable />
</template>

<style scoped></style>
