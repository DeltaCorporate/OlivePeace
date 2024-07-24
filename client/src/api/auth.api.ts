import apiClient from '@/../config/axios';
import { AxiosResponse } from 'axios';
import { ResponseType } from '@/types/response.type';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";
import {LoginData, RegisterData} from "@/types/auth.type.ts";



export const register = async (data: RegisterData, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post('/auth/register', data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
export const confirmEmail = async (token: string, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.get(`/auth/confirm/${token}`, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};

export const login = async (data: LoginData, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post('/auth/login', data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as any);
    }
};

export const requestPasswordReset = async (email: string, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post('/auth/request-password-reset', { email }, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as any);
    }
};

export const resetPassword = async (token: string, password: string, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post(`/auth/reset-password/${token}`, { password }, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as any);
    }
};

export const checkTokenExpiration = async (signal?: AbortSignal): Promise<ResponseType<{ expired: boolean }>> => {
    try {
        const response: AxiosResponse<ResponseType<{ expired: boolean }>> = await apiClient.get('/auth/is-expired', { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as any);
    }
};

export const deleteAccount = async (signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<{ expired: boolean }>> = await apiClient.delete('/auth/delete-account', { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as any);
    }
}