import apiClient from '@/../config/axios';
import { ResponseType } from '@/types/response.type';
import FilterBuilder from '@/utils/filter.util';
import {formatAxiosError, formatAxiosResponse} from "@/utils/response.util.ts";
import {AxiosError} from "axios";

export const getProducts = async (filterBuilder?: FilterBuilder | string, signal?: AbortSignal): Promise<ResponseType<any[]>> => {
    try {
        let queryString = filterBuilder ? '?' + filterBuilder : '';
        const response = await apiClient.get(`/products${queryString}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getProduct = async (slugOrId: string | number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/products/${slugOrId}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

