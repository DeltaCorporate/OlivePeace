import apiClient from '@/../config/axios.ts';
import {ResponseType} from "@/types/response.type";
import {AxiosResponse} from "axios/index";
import {formatAxiosError, formatAxiosResponse} from "@/utils/response.util";

interface AddToCardInterface {
    productId: string;
    name: string;
    price: number;
    quantity?: number;
    image: string;
}

export const getCart = async (userId: string, signal?: AbortSignal) => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.get(`/cart/${userId}`, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        console.error('Error fetching cart data', error);
        return formatAxiosError(error);
    }
};

export const addToCart = async (userId: string, data: AddToCardInterface , signal?: AbortSignal): Promise<any> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post(`/cart/${userId}/add`, data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
