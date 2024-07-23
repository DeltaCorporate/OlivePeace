<script setup lang="ts">
import GraphCardYear from '@/components/ui/GraphCardYear.vue';
import { getUserByMonth } from '@/api/stats.api';
import { getCurrentYear } from '@/utils/date.util';
</script>
<template>
  <GraphCardYear
      title="Nouveaux utilisateurs par mois"
      :fetchData="getUserByMonth"
      :defaultYear="getCurrentYear()"
  />
</template>
