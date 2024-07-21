<!-- src/components/BaseDashboard.vue -->
<script setup lang="ts">
import GraphCard from '@/components/ui/GraphCard.vue';
import GraphCardYear from '@/components/ui/GraphCardYear.vue';
import GraphStockPerMonth from '@/components/GraphStockPerMonth.vue';
import TopSellingProduct from "@/components/admin/TopSellingProduct.vue";
import { getSalesByYears, getSalesByMonth, getUserByMonth, getProductSalesEvolution } from '@/api/stats.api';
import { useGraph } from '@/composables/useGraph';
import GraphProductSalesEvolution from "@/components/GraphProductSalesEvolution.vue";

const { chartData: salesByYearsData, loading: salesByYearsLoading, error: salesByYearsError, loadData: loadSalesByYears } = useGraph(getSalesByYears);

loadSalesByYears();
</script>

<template>
  <div class="admin-dashboard p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GraphCardYear title="Ventes par mois" :fetchData="getSalesByMonth" />
      <GraphCard
          title="Ventes par années"
          :chartData="salesByYearsData"
          :loading="salesByYearsLoading"
          :error="salesByYearsError"
          @refresh="loadSalesByYears"
      />
      <GraphCardYear title="Nouveaux utilisateurs par mois" :fetchData="getUserByMonth" />
      <TopSellingProduct title="Produits les plus vendus par mois" :year="2023" />
      <GraphStockPerMonth title="Stock par mois" />
      <GraphProductSalesEvolution title="Évolution des ventes d'un produit" />

    </div>
  </div>
</template>