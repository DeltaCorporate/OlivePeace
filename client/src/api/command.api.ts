import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { CommandType, ResponseType } from '@/types/command.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

export const createCommand = async (commande: CommandType, signal?: AbortSignal): Promise<ResponseType<CommandType>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType>> = await apiClient.post('/commands', commande, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getCommand = async (id: number, signal?: AbortSignal): Promise<ResponseType<CommandType>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType>> = await apiClient.get(`/commands/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getCommands = async (params?: string, signal?: AbortSignal): Promise<ResponseType<CommandType[]>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType[]>> = await apiClient.get(`/commands${params ? '?' + params : ''}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getCommandsByUserId = async (userId: number, params?: string, signal?: AbortSignal): Promise<ResponseType<CommandType[]>> => {
    try {
        const response: AxiosResponse<ResponseType<CommandType[]>> = await apiClient.get(`/commands/user/${userId}${params ? '?' + params : ''}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
