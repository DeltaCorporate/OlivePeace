<template>
  <div class="flex space-x-2">

    <DeleteButton v-if="deleteMethod"  class="text-xs" :loading="loaders.delete" @click="handleDelete" />
    <EditButton v-if="editRoute" :route="editRoute" class="text-xs" />
    <ViewButton v-if="viewRoute" :route="viewRoute" class="text-xs" />

    <EditButton @click="editMethod" class="text-xs" />
    <ViewButton v-if="viewMethod" @click="viewMethod" class="text-xs" />

  </div>
</template>

<script setup lang="ts">
import DeleteButton from './DeleteButton.vue';
import EditButton from './EditButton.vue';
import ViewButton from './ViewButton.vue';
import { useAlertStore } from '@/stores/alerts.store.ts';

import {defineProps, defineEmits, reactive} from 'vue';

const props = defineProps({
  editRoute: {
    type: String,
    required: true
  },
  editMethod: {
    type: Function,
    required: true
  },
  viewRoute: {
    type: String,
    required: true
  },
  viewMethod: {
    type: Function,
    required: true
  },
  deleteMethod: {
    type: Function,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  row:{
    type: Object,
    required: true
  },
  itemIdKey: {
    type: String,
    default: '_id'
  }
});
const alertStore = useAlertStore();

const loaders = reactive({
  delete: false,
});
const emit = defineEmits(['delete']);

const handleDelete = async () => {
  const id = props.row.value[props.itemIdKey];
  loaders.delete = true;
  const response = await props.deleteMethod(id);
  if (response.code === 204) {
    props.data?.splice(props.data?.findIndex((item: any) => item[props.itemIdKey] === id), 1);
    alertStore.showAlert('La ligne a bien été supprimée', 'positive');
  }
  else
    alertStore.showAlert('Une erreur est survenue lors de la suppression', 'negative');

  loaders.delete = false;
}
</script>
