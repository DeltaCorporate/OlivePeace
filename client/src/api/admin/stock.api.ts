import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { StockType, ResponseType } from '@/types/stock.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

/**
 * Créer un nouveau stock
 * @param stock - Données du stock à créer
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec le stock créé ou une erreur formatée
 */
export const createStock = async (stock: StockType, signal?: AbortSignal): Promise<ResponseType<StockType>> => {
    try {
        const response: AxiosResponse<ResponseType<StockType>> = await apiClient.post('/admin/stocks', stock, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Mettre à jour un stock existant
 * @param id - ID du stock à mettre à jour
 * @param stock - Données du stock à mettre à jour
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec le stock mis à jour ou une erreur formatée
 */
export const updateStock = async (id: number, stock: StockType, signal?: AbortSignal): Promise<ResponseType<StockType>> => {
    try {
        const response: AxiosResponse<ResponseType<StockType>> = await apiClient.patch(`/admin/stocks/${id}`, stock, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Supprimer un stock
 * @param id - ID du stock à supprimer
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête ou une erreur formatée
 */
export const deleteStock = async (id: number, signal?: AbortSignal): Promise<ResponseType<void>> => {
    try {
        const response: AxiosResponse<ResponseType<void>> = await apiClient.delete(`/admin/stocks/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
