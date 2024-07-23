<!-- src/components/admin/DashboardLayoutList.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ConfigService } from '@/services/config.service';

const router = useRouter();
const layouts = ref([]);

const loadLayouts = async () => {
  const response = await ConfigService.getDashboardLayouts();
  if (response.isSuccess) {
    layouts.value = response.data;
  }
};

const editLayout = (id: string) => {
  router.push({ name: 'EditDashboardLayout', params: { id } });
};

const deleteLayout = async (id: string) => {
  // Implement delete logic here
  await loadLayouts();
};

const createNewLayout = () => {
  router.push({ name: 'CreateDashboardLayout' });
};

onMounted(loadLayouts);
</script>

<template>
  <div>
    <h2>Layouts de tableau de bord</h2>
    <ul>
      <li v-for="layout in layouts" :key="layout.id">
        {{ layout.name }}
        <button @click="editLayout(layout.id)">Modifier</button>
        <button @click="deleteLayout(layout.id)">Supprimer</button>
      </li>
    </ul>
    <button @click="createNewLayout">Créer un nouveau layout</button>
  </div>
</template>