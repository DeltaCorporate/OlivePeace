import {ref, onMounted, reactive, computed, onUnmounted} from 'vue';
import { usePagination } from './usePagination';
import FilterBuilder from "@/utils/filter.util.ts";

interface UseTableOptions {
    fetchData: (params: string) => Promise<any>;
}

export function useTable({ fetchData }: UseTableOptions) {
    const data = reactive<any[]>([]);
    const { pagination, setPagination } = usePagination();
    let abortController = new AbortController();
    const buildParams = reactive({
        filterBuilder: new FilterBuilder(),
        page: computed(() => pagination.currentPage),
    });

    async function fetchTableData() {
        abortController.abort();
        abortController = new AbortController();
        const result = await fetchData(buildQueryParams(), abortController.signal);
        data.splice(0, data.length, ...result.data);
        setPagination(result.pagination);
    }

    function buildQueryParams() {
        const filterParams = new URLSearchParams(buildParams.filterBuilder.build());
        filterParams.set('page', buildParams.page.toString());
        return filterParams.toString();
    }

    onMounted(fetchTableData);
    onUnmounted(() => abortController.abort());
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
        handleUpdateFilters,
        fetchTableData
    };
}
