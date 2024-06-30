<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import { ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-vue-next'; // Utilisation des icônes Lucid
import { SfInput } from '@storefront-ui/vue';

const props = defineProps<{
  renderAs?: string;
  header?: string;
  property?: string;
  row?: object;
  sortable?: boolean;
  searchable?: boolean;
  sortOrders?: { [key: string]: 'ASC' | 'DESC' | null };
  searchTerms?: { [key: string]: string };
}>();

const emits = defineEmits(['sort', 'search']);
const property = ref(props.property);

function handleSortAsk() {
  if (props.sortable)
    emits('sort', property.value);
}

function handleSearch(event) {
  emits('search', property.value, event.target.value);
}

const thClasses = computed(() => {
  return [
    'sticky px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer',
    { 'bg-primary-600': props.sortOrders[property.value] }
  ];
});
</script>

<template>
  <th
      v-if="props.renderAs === 'header'"
      :class="thClasses"
      @click="handleSortAsk"
  >
    <div class="flex items-center">
      <slot name="header" :header="props.header">
        {{ props.header }}
      </slot>
      <span v-if="props.sortable">
        <ArrowUpNarrowWide v-if="props.sortOrders[property] === 'ASC'" class="h-5 w-5"/>
        <ArrowDownWideNarrow v-else-if="props.sortOrders[property] === 'DESC'" class="h-5 w-5"/>
      </span>
    </div>
  </th>
  <td v-else-if="props.renderAs === 'cell'" class="px-3 py-1.5">
    <slot :value="property ? props.row[property] : props.row">
      {{ property ? props.row[property] : '' }}
    </slot>
  </td>
  <td v-else-if="props.renderAs === 'search'" class="px-3 py-1.5">
    <SfInput
        v-if="props.searchable"
        :placeholder="props.header"
        @input="handleSearch"
        :value="props.searchTerms[property.value]"

    />
  </td>
</template>
