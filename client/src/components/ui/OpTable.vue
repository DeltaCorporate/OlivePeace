<script setup lang="ts">
import { onMounted, reactive, useSlots } from 'vue';

const props = defineProps<{
  rowKeyField: string;
  data: any[];
}>();

const slots = useSlots();

const renderCols = (props) => {
  const cols = slots.default();
  cols.forEach(vnode => Object.assign(vnode.props ??= {}, props));
  return cols;
};
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
    <thead class="bg-primary-500">
    <tr>
      <render-cols renderAs="header"/>
    </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
    <tr v-for="row in props.data" :key="row[props.rowKeyField]" class="odd:bg-primary-50 hover:bg-primary-100 even:bg-white">
      <render-cols renderAs="cell" :row="row"/>
    </tr>
    </tbody>
  </table>
</template>

