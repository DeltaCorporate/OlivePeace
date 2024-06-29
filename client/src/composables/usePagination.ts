import { reactive, watch } from 'vue';
import {PaginationInterface} from "@/types/pagination.type.ts";

export function usePagination() {
    const pagination = reactive<PaginationInterface>({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
        limit: 10,
    });

    function setPagination(paginationData: PaginationInterface) {
        Object.assign(pagination, paginationData);
    }

    function getPaginationParams() {
        return {
            page: pagination.currentPage,
        };
    }

    return {
        pagination,
        setPagination,
        getPaginationParams,
    };
}
