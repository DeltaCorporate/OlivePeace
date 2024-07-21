import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { ProductType, ResponseType } from '@/types/product.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";
import {ProductCategoryType} from "@/types/product-category.type.ts";

export const createProduct = async (product: ProductType, signal?: AbortSignal): Promise<ResponseType<ProductType>> => {
    try {
        const response: AxiosResponse<ResponseType<ProductType>> = await apiClient.post('/admin/products', product, {
            signal,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updateProduct = async (id: number, product: ProductType, signal?: AbortSignal): Promise<ResponseType<ProductType>> => {
    try {
        const response: AxiosResponse<ResponseType<ProductType>> = await apiClient.patch(`/admin/products/${id}`, product, {
            signal,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const deleteProduct = async (id: number, signal?: AbortSignal): Promise<ResponseType<void>> => {
    try {
        const response: AxiosResponse<ResponseType<void>> = await apiClient.delete(`/admin/products/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getAllProduct = async (params?: string,signal?: AbortSignal): Promise<ResponseType<ProductType[]>> => {
    try {
        if(params) params = '?' + params;
        const response: AxiosResponse<ResponseType<ProductType[]>> = await apiClient.get('/admin/products/all'+params, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
}
