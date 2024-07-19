import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { StockType, ResponseType } from '@/types/stock.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

/**
 * Obtenir tous les stocks avec des filtres optionnels
 * @param params - Paramètres pour filtrer les stocks
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec les stocks ou une erreur formatée
 */
export const getStocks = async (params?: string, signal?: AbortSignal): Promise<ResponseType<StockType[]>> => {
    try {
        let queryString = params ? '?' + params : '';
        const response: AxiosResponse<ResponseType<StockType[]>> = await apiClient.get(`/stocks${queryString}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Obtenir un stock par ID
 * @param id - ID du stock
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec le stock ou une erreur formatée
 */
export const getStock = async (id: string, signal?: AbortSignal): Promise<ResponseType<StockType>> => {
    try {
        const response: AxiosResponse<ResponseType<StockType>> = await apiClient.get(`/stocks/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
