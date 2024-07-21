// src/composables/useGraph.ts
import { ref, computed } from 'vue';

export function useGraph(fetchDataFunction: (...args: any[]) => Promise<any>) {
    const chartData = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const formattedChartData = computed(() => {
        if (!chartData.value) return null;
        return {
            labels: chartData.value.labels,
            datasets: [{
                data: chartData.value.datasets,
                borderColor: '#02C652',
                backgroundColor: '#02C652'
            }]
        };
    });

    const loadData = async (...args: any[]) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetchDataFunction(...args);
            if (response.isSuccess) {
                chartData.value = response.data;
            } else {
                error.value = "Erreur lors de la récupération des données";
            }
        } catch (err) {
            error.value = "Une erreur est survenue";
        } finally {
            loading.value = false;
        }
    };

    return {
        chartData: formattedChartData,
        loading,
        error,
        loadData
    };
}