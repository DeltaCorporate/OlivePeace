<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import { Trash } from 'lucide-vue-next';
import { SfButton, SfInput, SfSelect } from '@storefront-ui/vue';
import * as dashboardComponents from '@/services/dashboard-components.service';
import { v4 as uuidv4 } from 'uuid';
import { useAlertStore } from "@/stores/alerts.store.ts";
import { getDashboardLayout, createDashboardLayout, updateDashboardLayout } from '@/api/dashboard-layouts.api';

const route = useRoute();
const router = useRouter();
const layoutId = route.params.id as string;
const isEditing = !!layoutId;
const layoutName = ref('');
const currentLayout = ref([]);


const availableWidgets = [
  { name: 'Ventes par mois', component: 'GraphSalesByMonth' },
  { name: 'Ventes par années', component: 'GraphSalesByYears' },
  { name: 'Utilisateurs par mois', component: 'GraphUserByMonth' },
  { name: 'Produits les plus vendus', component: 'TopSellingProduct' },
  { name: 'Stock par mois', component: 'GraphStockByMonth' },
  { name: 'Évolution des ventes', component: 'GraphProductSalesEvolution' },
];

const getComponent = (componentName: string) => {
  return dashboardComponents[componentName] || null;
};

const addWidget = (widget) => {
  const newWidget = {
    x: 0,
    y: 0,
    w: 6,
    h: 11,
    i: uuidv4(),
    component: widget.component
  };
  currentLayout.value.push(newWidget);
};

const removeWidget = (id: string) => {
  currentLayout.value = currentLayout.value.filter(item => item.i !== id);
};

const alertStore = useAlertStore();

const saveLayout = async () => {
  if (!layoutName.value) {
    alertStore.showAlert('Veuillez donner un nom au layout', 'negative');
    return;
  }

  const layoutToSave = {
    name: layoutName.value,
    layout: currentLayout.value,
  };

  try {
    let response;
    if (isEditing) {
      response = await updateDashboardLayout(layoutId, layoutToSave);
    } else {
      response = await createDashboardLayout(layoutToSave);
    }

    if (response.isSuccess) {
      alertStore.showAlert('Layout enregistré avec succès', 'positive');
      router.push({ name: 'DashboardLayoutList' });
    } else {
      throw new Error(response.errors[0]?.message || 'Une erreur est survenue');
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du layout:', error);
    alertStore.showAlert('Une erreur est survenue lors de l\'enregistrement', 'negative');
  }
};

onMounted(async () => {
  if (isEditing) {
    const response = await getDashboardLayout(layoutId);
    if (response.isSuccess) {
      const layout = response.data;
      layoutName.value = layout.name;
      currentLayout.value = layout.layout;
    } else {
      alertStore.showAlert('Erreur lors du chargement du layout', 'negative');
    }
  }
});
</script>


<template>
  <div class="dashboard-layout-editor flex">
    <div class="layout-area w-3/4 p-4">
      <div class="flex items-center mb-4">
        <SfInput v-model="layoutName" placeholder="Nom du layout" class="flex-grow mr-2"/>
        <SfButton @click="saveLayout">Enregistrer</SfButton>
      </div>
      <GridLayout
          v-model:layout="currentLayout"
          :col-num="12"
          :row-height="36"
          :is-draggable="true"
          :vertical-compact="true"
          :use-css-transforms="false"
          class="grid-layout"
      >

        <GridItem v-for="item in currentLayout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
          <component :is="getComponent(item.component)"/>
          <SfButton square variant="secondary" class="remove-widget" @click="removeWidget(item.i)">
            <Trash/>
          </SfButton>
        </GridItem>
      </GridLayout>
    </div>
    <div class="widget-menu w-1/4 p-4 bg-gray-100">
      <h3 class="text-xl font-bold mb-4">Widgets disponibles</h3>
      <div v-for="widget in availableWidgets" :key="widget.component" class="mb-2">
        <SfButton class="w-full" @click="addWidget(widget)">{{ widget.name }}</SfButton>
      </div>
    </div>
  </div>

</template>



<style scoped>
.grid-layout {
  background: #f0f0f0;
  min-height: 600px;
}
.remove-widget {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}
</style>