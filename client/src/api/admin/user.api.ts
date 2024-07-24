import apiClient from '../../../config/axios.ts';
import { ResponseType } from '@/types/response.type.ts';
import { formatAxiosResponse, formatAxiosError } from '@/utils/response.util.ts';
import { AxiosError } from 'axios';

export const getUsers = async (params?: string,signal?: AbortSignal): Promise<ResponseType<any[]>> => {
    params = params ? '?' + params : '';
    try {
        const response = await apiClient.get('/admin/users'+params,{signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const createUser = async (userData: any): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.post('/admin/users', userData);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updateUser = async (id: string, userData: any): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.put(`/admin/users/${id}`, userData);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const deleteUser = async (id: string): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const sendConfirmationEmail = async (id: string): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.post(`/admin/users/${id}/send-confirmation`);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getUser = async (id: string): Promise<ResponseType<any>> => {
    try {
        const response = await apiClient.get(`/admin/users/${id}`);
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
}