<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue';
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.setPageTitle("Inscription");

</script>

<template>
  <div class="max-w-md mx-auto mt-8">
    <RegisterForm />
  </div>
</template>