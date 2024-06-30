<template>
  <Button
      :icon="Eye"
      buttonClass="bg-primary-500 text-white"
      v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import Button from './Button.vue';
import { Eye } from 'lucide-vue-next';
</script>
