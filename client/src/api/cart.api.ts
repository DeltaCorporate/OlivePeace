import apiClient from '@/../config/axios.ts';
import {CartType, RegisterData} from "@/types/cart.type";
import {ResponseType} from "@/types/response.type";
import {AxiosResponse} from "axios/index";
import {formatAxiosError, formatAxiosResponse} from "@/utils/response.util";

export const fetchCart = async (userId: string) => {
    try {
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart data', error);
        throw error;
    }
};

export const addToCart = async (data: CartType, signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post('/cart/add', data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
