<template>
  <div class="flex flex-col min-h-screen">
    <ClientNavbar />
    <main class="flex-grow relative">
      <SfAlert/>
      <h1 class="typography-headline-1 my-5">{{ pageTitle }} </h1>
      <router-view />
    </main>
    <ClientFooter />
  </div>
</template>

<script setup lang="ts">
import ClientNavbar from '@/components/ClientNavbar.vue';
import ClientFooter from '@/components/ClientFooter.vue';
import SfAlert from "@/components/ui/SfAlert.vue";
</script>
