<!-- src/components/Banner.vue -->
<template>
  <div class="banner relative overflow-hidden">
    <img
        :src="currentImage"
        :alt="title"
        class="w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
      <h1 class="text-4xl font-bold mb-2 text-center">{{ title }}</h1>
      <p class="text-xl mb-4 text-center">{{ description }}</p>
      <SfButton @click="$emit('click')">{{ buttonText }}</SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SfButton } from '@storefront-ui/vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  buttonText: {
    type: String,
    default: 'En savoir plus'
  }
});

const currentImage = computed(() => {
  return window.innerWidth < 768 ? props.image.mobile : props.image.desktop;
});

defineEmits(['click']);
</script>

<style scoped>
.banner {
  height: 400px;
}

@media (min-width: 768px) {
  .banner {
    height: 500px;
  }
}
</style>