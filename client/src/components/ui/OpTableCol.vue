<script setup lang="ts">
const props = defineProps<{
  renderAs?: string;
  header?: string;
  property?: string;
  row?: any;
}>();
</script>

<template>
  <th v-if="props.renderAs === 'header'" class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
    <slot name="header" :header="props.header">
      {{ props.header }}
    </slot>
  </th>
  <td v-else-if="props.renderAs === 'cell'" class="px-6 py-4 whitespace-nowrap">
    <slot :value="props.property ? props.row[props.property] : props.row">
      {{ props.property ? props.row[props.property] : "" }}
    </slot>
  </td>
</template>