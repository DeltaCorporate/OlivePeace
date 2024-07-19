import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { CommandType, ResponseType } from '@/types/command.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

export const createCommand = async (order: CommandType, signal?: AbortSignal): Promise<ResponseType<CommandType>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType>> = await apiClient.post('/admin/commands', order, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const updateCommand = async (id: number, order: CommandType, signal?: AbortSignal): Promise<ResponseType<CommandType>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType>> = await apiClient.put(`/admin/commands/${id}`, order, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const deleteCommand = async (id: number, signal?: AbortSignal): Promise<ResponseType<void>> => {
    try {
        const response: AxiosResponse<ResponseType<void>> = await apiClient.delete(`/admin/commands/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
