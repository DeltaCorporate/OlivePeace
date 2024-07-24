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

export const getDashboardLayout = async (id: string): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/config/dashboard-layouts/${id}`);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const createDashboardLayout = async (layout: any): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.post('/config/dashboard-layouts', layout);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updateDashboardLayout = async (id: string, layout: any): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.put(`/config/dashboard-layouts/${id}`, layout);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const deleteDashboardLayout = async (id: string): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.delete(`/config/dashboard-layouts/${id}`);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updateLayoutSelection = async (selection): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.put('/config/dashboard-layout-selection', selection);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
}

export const getDashboardLayoutSelection = async (): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get('/config/dashboard-layout-selection');
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
