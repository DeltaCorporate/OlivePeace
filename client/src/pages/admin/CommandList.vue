<script setup>
import OrderTable from "@/components/admin/CommandTable.vue";
import {useAdminLayoutStore} from "@/stores/admin/admin-layout.store.ts";
import {onMounted} from "vue";
const adminLayoutStore = useAdminLayoutStore();

onMounted(() => {
  adminLayoutStore.setPageTitle("Liste des commandes");
});
</script>
<template>
  <OrderTable />
</template>
<style scoped> </style>