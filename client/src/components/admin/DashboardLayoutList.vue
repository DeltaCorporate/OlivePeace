<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Trash } from 'lucide-vue-next';
import { SfButton, SfIconDelete, SfInput, SfCheckbox } from '@storefront-ui/vue';
import { useAlertStore } from "@/stores/alerts.store.ts";
import { getDashboardLayouts, deleteDashboardLayout, updateLayoutSelection } from '@/api/dashboard-layouts.api';
import { object2Array } from "@/utils/divers.util.ts";

const router = useRouter();
const layouts = ref([]);
const alertStore = useAlertStore();

const roles = [
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_STORE_KEEPER', label: 'Gestionnaire de stock' },
];

const loadLayouts = async () => {
  const response = await getDashboardLayouts();

  if (response.isSuccess) {
    layouts.value = object2Array(response.data).map(layout => ({
      ...layout,
      priority: layout.priority || 0,
      roles: layout.roles || []
    }));
    console.log(layouts.value);
  } else {
    alertStore.showAlert('Erreur lors du chargement des layouts', 'negative');
  }
};

const editLayout = (id: string) => {
  router.push({ name: 'EditDashboardLayout', params: { id } });
};

const deleteLayout = async (id: string) => {
  try {
    const response = await deleteDashboardLayout(id);
    if (response.isSuccess) {
      alertStore.showAlert('Layout supprimé avec succès', 'positive');
      await loadLayouts();
    } else {
      throw new Error(response.errors[0]?.message || 'Une erreur est survenue lors de la suppression');
    }
  } catch (error) {
    alertStore.showAlert('Erreur lors de la suppression du layout', 'negative');
  }
};

const updateSelection = async (layout) => {
  try {
    const response = await updateLayoutSelection({
      layoutId: layout._id,
      priority: layout.priority,
      roles: layout.roles
    });
    if (response.isSuccess) {
      alertStore.showAlert('Sélection mise à jour avec succès', 'positive');
      await loadLayouts();
    } else {
      throw new Error(response.errors[0]?.message || 'Une erreur est survenue lors de la mise à jour');
    }
  } catch (error) {
    alertStore.showAlert('Erreur lors de la mise à jour de la sélection', 'negative');
  }
};

const createNewLayout = () => {
  router.push({ name: 'CreateDashboardLayout' });
};

const toggleRole = (layout, roleValue) => {
  const index = layout.roles.indexOf(roleValue);
  if (index > -1) {
    layout.roles.splice(index, 1);
  } else {
    layout.roles.push(roleValue);
  }
};

onMounted(loadLayouts);
</script>



<template>
  <div class="dashboard-layouts">
    <div class="header">
      <h2 class="title">Layouts de tableau de bord</h2>
      <SfButton @click="createNewLayout" class="create-button">Créer un nouveau layout</SfButton>
    </div>
    <ul class="layout-list">
      <li v-for="layout in layouts" :key="layout._id" class="layout-item">
        <div class="layout-header">
          <h3 class="layout-name">{{ layout.name }}</h3>
          <div class="layout-actions">
            <SfButton @click="editLayout(layout._id)" class="edit-button">
              <Trash />
              Modifier
            </SfButton>
            <SfButton @click="deleteLayout(layout._id)" class="delete-button">
              <SfIconDelete />
              Supprimer
            </SfButton>
          </div>
        </div>
        <div class="priority-setting">
          <h4 class="priority-title">Priorité du layout</h4>
          <SfInput v-model="layout.priority" type="number" class="priority-input" />
        </div>
        <div class="role-selection">
          <h4 class="role-title">Rôles associés</h4>
          <div class="role-checkboxes">
            <div v-for="role in roles" :key="role.value" class="role-checkbox">
              <SfCheckbox
                  :modelValue="layout.roles.includes(role.value)"
                  @update:modelValue="toggleRole(layout, role.value)"
              />
              <span>{{ role.label }}</span>
            </div>
          </div>
        </div>
        <SfButton @click="updateSelection(layout)" class="update-button">
          Mettre à jour la sélection
        </SfButton>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dashboard-layouts {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.create-button {
  background-color: #4CAF50;
  color: white;
}

.layout-list {
  list-style-type: none;
  padding: 0;
}

.layout-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.layout-name {
  font-size: 20px;
  font-weight: bold;
}

.layout-actions {
  display: flex;
  gap: 10px;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.role-selection, .priority-settings {
  margin-bottom: 15px;
}

.role-title, .priority-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.priority-setting {
  margin-bottom: 15px;
}

.priority-input {
  width: 100px;
}

.role-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.role-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}


.priority-input {
  width: 80px;
}

.update-button {
  background-color: #FF9800;
  color: white;
  width: 100%;
  margin-top: 15px;
}
</style>