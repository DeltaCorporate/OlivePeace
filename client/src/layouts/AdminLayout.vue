<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
</script>
<template>
  <div class="flex flex-row w-full h-screen">
    <div>
      <Sidebar/>
    </div>
    <main class="px-6 py-6 flex-1 bg-gray-100 overflow-y-auto">
      <router-view/>
    </main>
  </div>
</template>
