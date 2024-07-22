<script setup lang="ts">
import Cart from '@/components/Cart.vue';
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.setPageTitle("Cart");

</script>

<template>
  <div class="max-w mx-auto mt-8">
    <Cart />
  </div>
</template>