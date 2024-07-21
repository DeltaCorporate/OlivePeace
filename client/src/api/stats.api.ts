import apiClient from '@/../config/axios';
import { ResponseType } from '@/types/response.type';
import { formatAxiosError, formatAxiosResponse } from "@/utils/response.util.ts";
import { AxiosError } from "axios";

export const getStockPerMonth = async (productId: string, year: number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/stats/stock-per-month?productId=${productId}&year=${year}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getSalesByYears = async (signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get('/stats/salesByYears', { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getSalesByMonth = async (year: number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/stats/salesByMonth/${year}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getUserByMonth = async (year: number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/stats/user-by-month/${year}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getMostSoldProductByMonth = async (year: number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/stats/most-sold-product-by-month/${year}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};


export const getProductSalesEvolution = async (productId: string, year: number, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/stats/product-sales-evolution?productId=${productId}&year=${year}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};