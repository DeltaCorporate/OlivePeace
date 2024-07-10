<script setup lang="ts">
import PromotionTable from '@/components/admin/PromotionTable.vue';
import {useAdminLayoutStore} from '@/stores/admin/admin-layout.store.ts';

const store = useAdminLayoutStore();
store.setPageTitle('Liste des promotions');
</script>
<template>
  <div>
    <PromotionTable />
  </div>
</template>



<style scoped>
</style>
