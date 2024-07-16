<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
  label?: string;
  error?: string;
  id: string;
}>();
</script>
<template>
  <div class="sf-form-field mb-4">
    <label v-if="label" :for="id" class="sf-label mb-1 block">{{ label }}</label>
    <slot :id="id"></slot>
    <p v-if="error" class="sf-text-error mt-1 text-sm">{{ error }}</p>
  </div>
</template>
