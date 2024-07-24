<!-- src/components/BaseDashboard.vue -->
<script setup lang="ts">
import GraphCard from '@/components/ui/GraphCard.vue';
import GraphCardYear from '@/components/ui/GraphCardYear.vue';
import GraphStockByMonth from '@/components/graph/GraphStockByMonth.vue';
import TopSellingProduct from "@/components/graph/TopSellingProduct.vue";
import { getSalesByYears, getSalesByMonth, getUserByMonth, getProductSalesEvolution } from '@/api/stats.api';
import { useGraph } from '@/composables/useGraph';
import GraphProductSalesEvolution from "@/components/graph/GraphProductSalesEvolution.vue";
import GraphSalesByMonth from "@/components/graph/GraphSalesByMonth.vue";
import GraphSalesByYears from "@/components/graph/GraphSalesByYears.vue";
import GraphUserByMonth from "@/components/graph/GraphUserByMonth.vue";

const { chartData: salesByYearsData, loading: salesByYearsLoading, error: salesByYearsError, loadData: loadSalesByYears } = useGraph(getSalesByYears);

loadSalesByYears();
</script>

<template>
  <div class="admin-dashboard p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GraphSalesByMonth title="Ventes par mois" :fetchData="getSalesByMonth" />
      <GraphSalesByYears />
      <GraphUserByMonth />
      <TopSellingProduct title="Produits les plus vendus par mois" :year="2023" />
      <GraphStockByMonth title="Stock par mois" />
      <GraphProductSalesEvolution />

    </div>
  </div>
</template>