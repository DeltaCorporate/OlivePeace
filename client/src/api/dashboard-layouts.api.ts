// src/api/dashboard-layouts.api.ts
import apiClient from '@/../config/axios';
import { ResponseType } from '@/types/response.type';
import { formatAxiosResponse, formatAxiosError } from '@/utils/response.util';
import { AxiosError } from 'axios';

export const getDashboardLayouts = async (): Promise<ResponseType<any[]>> => {
    try {
        const response = await apiClient.get('/config/dashboard-layouts');
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const setDashboardLayouts = async (layouts: any[]): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.post('/config/dashboard-layouts', { layouts });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getDashboardLayoutSelection = async (): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get('/config/dashboard-layout-selection');
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const setDashboardLayoutSelection = async (selection: any): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.post('/config/dashboard-layout-selection', { selection });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};