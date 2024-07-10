<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import SfAlert from "@/components/ui/SfAlert.vue";
import {computed} from "vue";
import {useAdminLayoutStore} from "@/stores/admin/admin-layout.store.ts";
const adminLayoutStore = useAdminLayoutStore();

const pageTitle = computed(() => adminLayoutStore.pageTitle);

</script>
<template>
  <div class="flex flex-row w-full h-screen">
    <div>
      <Sidebar/>
    </div>
    <main class="px-6 py-6 flex-1 relative bg-neutral-100 relative overflow-y-auto">
      <SfAlert/>
      <h1 class="typography-headline-1 my-5">{{ pageTitle }} </h1>
      <router-view class="animate-fade"/>
    </main>
  </div>
</template>
