import {ref, onMounted, watchEffect, reactive, computed} from 'vue';
import { usePagination } from './usePagination';
import FilterBuilder from "@/utils/filter.util.ts";
import {PaginationInterface} from "@/types/pagination.type.ts";

export function useTable(fetchData: (params: string) => Promise<void>) {
    const data = reactive([]);
    const { pagination, setPagination } = usePagination();
    const buildParams = reactive({
       filterBuilder: new FilterBuilder(),
        page: computed(() => pagination.currentPage),
    });
    async function fetchTableData() {
        let result = await fetchData(buildQueryParams());
        data.splice(0, data.length, ...result.data.data);
        setPagination(result.data.pagination);
        return data;
    }

    function buildQueryParams() {
        const filterParams = new URLSearchParams(buildParams.filterBuilder.build());
        filterParams.set('page', buildParams.page.toString());
        return filterParams.toString();
    }


    onMounted(fetchTableData);

    async function handleSort(filterBuilder: FilterBuilder) {
        buildParams.filterBuilder = filterBuilder;
        await fetchTableData();
    }

    async function handlePageChange(page: number) {
        pagination.currentPage = page;
        await fetchTableData();
    }

    return {
        data,
        pagination,
        handleSort,
        handlePageChange,
    };
}
