<script setup lang="ts">
import { ref } from 'vue';
import GraphCard from './GraphCard.vue';
import { useGraph } from '@/composables/useGraph';

const props = defineProps({
  title: { type: String, required: true },
  fetchData: { type: Function, required: true },
  defaultYear: { type: Number, default: new Date().getFullYear() }
});

const year = ref(props.defaultYear);

const { chartData, loading, error, loadData } = useGraph(props.fetchData);

const refreshData = () => {
  loadData(year.value);
};

refreshData();
</script>

<template>
  <GraphCard
      :title="title"
      :chartData="chartData"
      :loading="loading"
      :error="error"
      @refresh="refreshData"
  >
    <template #toolbar>
      <div class="w-full p-2">
        <input
            v-model.number="year"
            type="number"
            pattern="\d{4}"
            class="border rounded px-2 py-1 mt-2"
            @change="refreshData"
        />
        <slot name="toolbar-content"></slot>
      </div>
    </template>
  </GraphCard>
</template>