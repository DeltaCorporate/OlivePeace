<template>
  <Button
      :icon="Trash"
      buttonClass="bg-negative-700 hover:bg-negative-600 text-white"
      v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import Button from './Button.vue';
import { Trash } from 'lucide-vue-next';
</script>
