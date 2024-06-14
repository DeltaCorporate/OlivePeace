<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
</script>
<template>
  <div class="flex h-screen">
    <Sidebar/>
    <main class="flex-1 p-6 bg-gray-100">
      <router-view/>
    </main>
  </div>
</template>
