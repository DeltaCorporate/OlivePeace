<script setup lang="ts">
import {useAdminLayoutStore} from "@/stores/admin/admin-layout.store.ts";
import BaseDashbard from "@/components/admin/BaseDashbard.vue";

const adminLayoutStore = useAdminLayoutStore();

adminLayoutStore.setPageTitle("Tableau de bord administrateur");
</script>

<template>
<BaseDashbard />
</template>
