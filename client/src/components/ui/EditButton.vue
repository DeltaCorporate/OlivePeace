<template>
  <Button
      :icon="Edit"
      buttonClass="bg-secondary-500 text-white"
      v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import Button from './Button.vue';
import { Edit } from 'lucide-vue-next';
</script>
