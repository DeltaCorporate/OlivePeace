<script setup lang="ts">
import { SfRating } from '@storefront-ui/vue';

defineProps({
  review: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <div class="review-card bg-white p-4 rounded-lg shadow">
    <div class="flex items-center mb-2">
      <span class="font-semibold mr-2">{{ review.name }}</span>
      <div class="flex">
        <SfRating :value="review.rating" max="5" />
      </div>
    </div>
    <p class="text-gray-600">{{ review.comment }}</p>
  </div>
</template>
