<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { ConfigService } from '@/services/config.service';
import { useAdminLayoutStore } from "@/stores/admin/admin-layout.store";
import BaseDashboard from "@/components/admin/BaseDashbard.vue";
import CustomDashboard from "@/components/admin/CustomDashboard.vue";

const authStore = useAuthStore();
const adminLayoutStore = useAdminLayoutStore();
const dashboardComponent = ref(BaseDashboard);

adminLayoutStore.setPageTitle("Tableau de bord administrateur");

onMounted(async () => {
  try {
    const selectionResponse = await ConfigService.getDashboardLayoutSelection();
    if (selectionResponse.isSuccess) {
      const selection = selectionResponse.data;
      let selectedLayout = null;
      let highestPriority = -1;

      for (const role of authStore.user.roles) {
        if (selection[role] && selection[role].priority > highestPriority) {
          selectedLayout = selection[role].layout;
          highestPriority = selection[role].priority;
        }
      }

      if (selectedLayout) {
        const layoutsResponse = await ConfigService.getDashboardLayouts();
        if (layoutsResponse.isSuccess) {
          const layout = layoutsResponse.data.find(l => l.id === selectedLayout);
          if (layout) {
            dashboardComponent.value = CustomDashboard;
          }
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error);
  }
});
</script>

<template>
  <component :is="dashboardComponent" />
</template>