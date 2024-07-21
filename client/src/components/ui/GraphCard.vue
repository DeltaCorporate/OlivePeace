<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { SfLoaderCircular, SfButton } from '@storefront-ui/vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps({
  title: { type: String, required: true },
  chartData: { type: Object, required: true },
  loading: { type: Boolean, required: true },
  error: { type: String, default: null }
});

const emit = defineEmits(['refresh']);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
</script>

<template>
  <div class="graph-card bg-neutral-50 shadow-md rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <slot name="toolbar" class="w-full"></slot>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <SfLoaderCircular size="lg" />
    </div>
    <div v-else-if="error" class="text-negative-700 text-center h-64 flex flex-col items-center justify-center">
      <p>{{ error }}</p>
      <SfButton class="mt-4" @click="$emit('refresh')">Rafraîchir</SfButton>
    </div>
    <div v-else-if="chartData" class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>