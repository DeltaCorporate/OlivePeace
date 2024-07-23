<script setup lang="ts">
import GraphCardYear from '@/components/ui/GraphCardYear.vue';
import { getSalesByMonth } from '@/api/stats.api';
import { getCurrentYear } from '@/utils/date.util';
</script>
<template>
  <GraphCardYear
      title="Ventes par mois"
      :fetchData="getSalesByMonth"
      :defaultYear="getCurrentYear()"
  />
</template>
