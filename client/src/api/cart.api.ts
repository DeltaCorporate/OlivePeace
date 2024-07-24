import apiClient from '@/../config/axios.ts';
import {ResponseType} from "@/types/response.type";
import {AxiosResponse} from "axios";
import {formatAxiosError, formatAxiosResponse} from "@/utils/response.util";

interface AddToCartInterface {
    productId: string;
    quantity?: number;
}

export const getCart = async (userId: string, signal?: AbortSignal): Promise<any> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.get(`/cart/${userId}`, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};

export const addToCart = async (userId: string, data: AddToCartInterface, signal?: AbortSignal): Promise<any> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post(`/cart/${userId}/add`, data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
