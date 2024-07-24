import apiClient from '@/../config/axios';
import { ResponseType } from '@/types/response.type';
import { formatAxiosError, formatAxiosResponse } from "@/utils/response.util.ts";
import { AxiosError } from "axios";

export const getOrders = async (params?: string | string, signal?: AbortSignal): Promise<ResponseType<any[]>> => {
    try {
        let queryString = params ? '?' + params : '';
        const response = await apiClient.get(`/orders${queryString}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getOrder = async (id: string, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/orders/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};