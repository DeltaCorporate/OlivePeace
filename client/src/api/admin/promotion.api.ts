import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { PromotionType, ResponseType } from '@/types/promotion.type.ts';
import Filter from "@/utils/filter.util.ts";
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

export const getPromotions = async (filterInstance?: Filter, signal?: AbortSignal): Promise<ResponseType<PromotionType[]>> => {
    try {
        let queryString = filterInstance ? '?' + filterInstance.toString() : '';
        const response: AxiosResponse = await apiClient.get(`/admin/promotions${queryString}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getPromotion = async (id: string, signal: AbortSignal): Promise<ResponseType<PromotionType>> => {
    try {
        const response: AxiosResponse<ResponseType<PromotionType>> = await apiClient.get(`/admin/promotions/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const createPromotion = async (promotion: PromotionType, signal: AbortSignal): Promise<ResponseType<PromotionType>> => {
    try {
        const response: AxiosResponse<ResponseType<PromotionType>> = await apiClient.post('/admin/promotions', promotion, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updatePromotion = async (id: string, promotion: PromotionType, signal: AbortSignal): Promise<ResponseType<PromotionType>> => {
    try {
        const response: AxiosResponse<ResponseType<PromotionType>> = await apiClient.patch(`/admin/promotions/${id}`, promotion, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const deletePromotion = async (id: string, signal: AbortSignal): Promise<ResponseType<void>> => {
    try {
        const response: AxiosResponse<ResponseType<void>> = await apiClient.delete(`/admin/promotions/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
