<script setup lang="ts">
import { ref, defineEmits, defineProps, useSlots } from 'vue';
import FilterBuilder from '@/utils/filter.util.ts';

const props = defineProps<{
  rowKeyField: string;
  data: any[];
}>();

const emits = defineEmits(['sort']);
const slots = useSlots();

const sortOrders = ref<{ [key: string]: 'ASC' | 'DESC' | null }>({});
const filterBuilder = ref(new FilterBuilder());

function handleSort(property: string) {
  if (sortOrders.value[property] === 'ASC') sortOrders.value[property] = 'DESC';
  else if (sortOrders.value[property] === 'DESC') sortOrders.value[property] = null;
  else sortOrders.value[property] = 'ASC';

  filterBuilder.value = new FilterBuilder();
  Object.keys(sortOrders.value).forEach((key) => {
    if (sortOrders.value[key])
      filterBuilder.value.add(key).ord(sortOrders.value[key]);
  });
  emits('sort', filterBuilder.value);
}

const renderCols = (props: any) => {
  const cols = slots.default ? slots.default() : [];
  cols.forEach((vnode: any) => {
    Object.assign(vnode.props ??= {}, props);
  });
  return cols;
};

</script>

<template>
  <table class="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
    <thead class="bg-primary-500">
    <tr>
      <render-cols :renderAs="'header'" @sort="handleSort" :sortOrders="sortOrders" />
    </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
    <tr
        v-for="row in props.data"
        :key="row[props.rowKeyField]"
        class="odd:bg-primary-50 hover:bg-primary-100 even:bg-white"
    >
      <render-cols :renderAs="'cell'" :row="row" />
    </tr>
    </tbody>
  </table>
</template>
