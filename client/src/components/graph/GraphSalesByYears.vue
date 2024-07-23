<script setup lang="ts">
import GraphCard from '@/components/ui/GraphCard.vue';
import { getSalesByYears } from '@/api/stats.api';
import { useGraph } from '@/composables/useGraph';

const { chartData, loading, error, loadData } = useGraph(getSalesByYears);

loadData();
</script>
<template>
  <GraphCard
      title="Ventes par années"
      :chartData="chartData"
      :loading="loading"
      :error="error"
      @refresh="loadData"
  />
</template>

