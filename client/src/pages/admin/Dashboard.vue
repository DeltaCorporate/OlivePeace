<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { ConfigService } from '@/services/config.service';
import { useAdminLayoutStore } from "@/stores/admin/admin-layout.store";
import BaseDashboard from "@/components/admin/BaseDashbard.vue";
import CustomDashboard from "@/components/admin/CustomDashboard.vue";
import {getDashboardLayouts, getDashboardLayoutSelection} from "@/api/dashboard-layouts.api.ts";
import {SfLoaderCircular} from "@storefront-ui/vue";

const authStore = useAuthStore();
const adminLayoutStore = useAdminLayoutStore();
const dashboardComponent = ref(null);
adminLayoutStore.setPageTitle("Tableau de bord administrateur");


const getUserLayout = async () => {
  try {
    // Vérifiez si l'utilisateur est authentifié et a des rôles
    if (!authStore.isAuthenticated || !authStore.user || !Array.isArray(authStore.user.roles)) {
      console.error('Utilisateur non authentifié ou rôles non définis');
      return null;
    }

    const layoutsResponse = await getDashboardLayouts();
    const selectionResponse = await getDashboardLayoutSelection();

    if (layoutsResponse.isSuccess && selectionResponse.isSuccess) {
      const layouts = Object.values(layoutsResponse.data);
      const selection = selectionResponse.data;
      const userRoles = authStore.user.roles;
      let selectedLayout = null;
      let highestPriority = -1;

      for (const [layoutId, config] of Object.entries(selection)) {
        if (config.roles.some(role => userRoles.includes(role)) && config.priority > highestPriority) {
          const layout = layouts.find(l => l._id === layoutId);

          if (layout) {
            selectedLayout = layout;
            highestPriority = config.priority;
          }
        }
      }

      if (selectedLayout) {
        dashboardComponent.value = 'CustomDashboard';
        return selectedLayout;
      }else {
        dashboardComponent.value = 'BaseDashboard';
        return null;
      }
    }
  } catch (error) {
    dashboardComponent.value = 'BaseDashboard';
    console.error('Erreur lors du chargement du dashboard:', error);
  }
  return null;
};

const currentLayout = ref(null);

onMounted(async () => {
  const data = await getUserLayout();
  currentLayout.value = data.layout;
});
</script>

<template>

  <div v-if="dashboardComponent">
    <CustomDashboard v-if="currentLayout && dashboardComponent == 'CustomDashboard'" :layout="currentLayout" />
    <BaseDashboard v-else/>
  </div>
  <div v-else class="flex justify-center h-full w-full items-center">
    <SfLoaderCircular class="mx-auto" size="xl"/>
  </div>

</template>