<script setup lang="ts">
import ClientNavbar from '@/components/ClientNavbar.vue';
import ClientFooter from '@/components/ClientFooter.vue';
import SfAlert from "@/components/ui/SfAlert.vue";

import {useClientLayoutStore} from "@/stores/client-layout.store.ts";

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.pageTitle = 'Liste des produits'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <ClientNavbar />
    <main class="flex-grow relative p-5">

      <h1 class="typography-headline-1 mt-5 mb-8 w-full text-center">{{ clientLayoutStore.pageTitle }} </h1>

      <SfAlert/>
      <router-view />
    </main>
    <ClientFooter />
  </div>
</template>

