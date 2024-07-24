import apiClient from '@/../config/axios.ts';
import {ResponseType} from "@/types/response.type";
import {AxiosResponse} from "axios";
import {formatAxiosError, formatAxiosResponse} from "@/utils/response.util";

interface AddToCartInterface {
    productId: string;
    quantity?: number;
}

export const getCart = async (signal?: AbortSignal): Promise<any> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.get(`/cart/`, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};

export const addToCart = async (data: AddToCartInterface, signal?: AbortSignal): Promise<any> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post(`/cart/add`, data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
