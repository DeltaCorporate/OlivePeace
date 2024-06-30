<template>
  <div class="flex space-x-2">
    <DeleteButton class="text-xs" :loading="loaders.delete" @click="handleDelete" />
    <EditButton :route="editRoute" class="text-xs" />
    <ViewButton :route="viewRoute" class="text-xs" />
  </div>
</template>

<script setup lang="ts">
import DeleteButton from './DeleteButton.vue';
import EditButton from './EditButton.vue';
import ViewButton from './ViewButton.vue';
import {defineProps, defineEmits, reactive} from 'vue';

const props = defineProps({
  editRoute: {
    type: String,
    required: true
  },
  viewRoute: {
    type: String,
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

const loaders = reactive({
  delete: false,
});
const emit = defineEmits(['delete']);

const handleDelete = async () => {
  const id = props.row.value[props.itemIdKey];
  loaders.delete = true;
  const response = await props.deleteMethod(id);
  if(response)
    props.data?.splice(props.data?.findIndex((item: any) => item[props.itemIdKey] === id), 1);

  };
</script>
