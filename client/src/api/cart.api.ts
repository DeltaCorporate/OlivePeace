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

export const getCart = async (userId: string) => {
    try {
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart data', error);
        throw error;
    }
};

export const addToCart = async (data: AddToCardInterface  , signal?: AbortSignal): Promise<ResponseType<any>> => {
    try {
        const response: AxiosResponse<ResponseType<any>> = await apiClient.post('/cart/${userId}/add', data, {signal});
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error);
    }
};
