<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import { v4 as uuidv4 } from 'uuid';
import { SfButton, SfInput, SfSelect, SfIconDelete } from '@storefront-ui/vue';
import { ConfigService } from '@/services/config.service';
import * as dashboardComponents from '@/services/dashboard-components.service';
import {useAlertStore} from "@/stores/alerts.store.ts";

const route = useRoute();
const router = useRouter();
const layoutId = route.params.id as string;
const isEditing = !!layoutId;

const layoutName = ref('');
const currentLayout = ref([]);
const selectedRole = ref('ROLE_ADMIN');

const priority = ref(1);

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
    h: 9,
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
    id: isEditing ? layoutId : uuidv4(),
    name: layoutName.value,
    layout: currentLayout.value,
  };

  try {
    await updateLayouts(layoutToSave);
    await updateLayoutSelection(layoutToSave.id);

    alertStore.showAlert('Layout enregistré et assigné avec succès', 'positive');
    router.push({ name: 'DashboardLayoutList' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du layout:', error);
    alertStore.showAlert('Une erreur est survenue lors de l\'enregistrement', 'negative');
  }
};

const updateLayouts = async (layoutToSave) => {
  const layoutsResponse = await ConfigService.getDashboardLayouts();
  const layouts = Array.isArray(layoutsResponse.data) ? layoutsResponse.data : [];

  const layoutIndex = layouts.findIndex(l => l.id === layoutToSave.id);
  if (layoutIndex !== -1) {
    layouts[layoutIndex] = layoutToSave;
  } else {
    layouts.push(layoutToSave);
  }

  const setLayoutsResponse = await ConfigService.setDashboardLayouts(layouts);
  if (!setLayoutsResponse.isSuccess) {
    throw new Error('Erreur lors de l\'enregistrement du layout');
  }
};

const updateLayoutSelection = async (layoutId) => {
  const selectionResponse = await ConfigService.getDashboardLayoutSelection();
  const selection = selectionResponse.isSuccess ? selectionResponse.data : {};

  selection[selectedRole.value] = {
    layout: layoutId,
    priority: selectedRole.value === 'ROLE_ADMIN' ? 10 : 1
  };

  const setSelectionResponse = await ConfigService.setDashboardLayoutSelection(selection);
  if (!setSelectionResponse.isSuccess) {
    throw new Error('Erreur lors de l\'assignation du layout');
  }
};

onMounted(async () => {
  if (isEditing) {
    const layouts = await ConfigService.getDashboardLayouts();
    if (layouts.isSuccess) {
      const layout = layouts.data.find(l => l.id === layoutId);
      if (layout) {
        layoutName.value = layout.name;
        currentLayout.value = layout.layout;
      }
    }
  }
});
</script>
<template>
  <div class="dashboard-layout-editor flex">
    <div class="layout-area w-3/4 p-4">
      <div class="flex items-center mb-4">
        <SfInput v-model="layoutName" placeholder="Nom du layout" class="flex-grow mr-2"/>
        <SfSelect v-model="selectedRole" class="w-48 mr-2">
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_STORE_KEEPER">Gestionnaire de stock</option>
        </SfSelect>
        <SfButton @click="saveLayout">Enregistrer</SfButton>
      </div>
      <GridLayout
          v-model:layout="currentLayout"
          :col-num="12"
          :row-height="36"
          :is-draggable="true"
          :vertical-compact="true"
          :prevent-collision="true"
          :use-css-transforms="false"
          class="grid-layout"
      >

        <GridItem v-for="item in currentLayout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
          <component :is="getComponent(item.component)"/>
          <SfButton square variant="secondary" class="remove-widget" @click="removeWidget(item.i)">
            <SfIconDelete/>
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