import { ref, onMounted, reactive, computed } from 'vue';
import { usePagination } from './usePagination';
import FilterBuilder from "@/utils/filter.util.ts";

export function useTable(fetchData: (params: string) => Promise<any>) {
    const data = reactive([]);
    const { pagination, setPagination } = usePagination();
    const buildParams = reactive({
        filterBuilder: new FilterBuilder(),
        page: computed(() => pagination.currentPage),
    });

    async function fetchTableData() {
        const result = await fetchData(buildQueryParams());
        data.splice(0, data.length, ...result.data.data);
        setPagination(result.data.pagination);
    }

    function buildQueryParams() {
        const filterParams = new URLSearchParams(buildParams.filterBuilder.build());
        filterParams.set('page', buildParams.page.toString());
        return filterParams.toString();
    }

    onMounted(fetchTableData);

    async function handleUpdateFilters(filterBuilder: FilterBuilder) {
        buildParams.filterBuilder = filterBuilder;
        pagination.currentPage = 1;
        await fetchTableData();
    }

    async function handlePageChange(page: number) {
        pagination.currentPage = page;
        await fetchTableData();
    }


    return {
        data,
        pagination,
        handlePageChange,
        handleUpdateFilters
    };
}
