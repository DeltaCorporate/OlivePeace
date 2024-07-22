<!-- src/components/admin/CustomDashboard.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import { useAuthStore } from '@/stores/auth.store';
import { ConfigService } from '@/services/config.service';
import * as dashboardComponents from '@/services/dashboard-components.service.ts'

const authStore = useAuthStore();
const layout = ref(null);

const getComponent = (componentName: string) => {
  return dashboardComponents[componentName] || null;
};

onMounted(async () => {
  layout.value = await ConfigService.getDashboardLayout(authStore.user.roles);
});
</script>

<template>
  <div>
    <grid-layout
        v-if="layout"
        :layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="true"
        :use-css-transforms="true"
    >
      <grid-item
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"

      >
        <component :is="getComponent(item.component)" />
      </grid-item>
    </grid-layout>
  </div>
</template>