import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { ProductCategoryType, ResponseType } from '@/types/product-category.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";


/**
 * Créer une nouvelle catégorie de produit
 * @param category - Données de la catégorie de produit à créer
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec la catégorie de produit créée ou une erreur formatée
 */
export const createProductCategory = async (category: ProductCategoryType, signal?: AbortSignal): Promise<ResponseType<ProductCategoryType>> => {
    try {
        const response: AxiosResponse<ResponseType<ProductCategoryType>> = await apiClient.post('/admin/product_categories', category, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Mettre à jour une catégorie de produit existante
 * @param id - ID de la catégorie de produit à mettre à jour
 * @param category - Données de la catégorie de produit à mettre à jour
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec la catégorie de produit mise à jour ou une erreur formatée
 */
export const updateProductCategory = async (id: number, category: ProductCategoryType, signal?: AbortSignal): Promise<ResponseType<ProductCategoryType>> => {
    try {
        const response: AxiosResponse<ResponseType<ProductCategoryType>> = await apiClient.patch(`/admin/product_categories/${id}`, category, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Supprimer une catégorie de produit
 * @param id - ID de la catégorie de produit à supprimer
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête ou une erreur formatée
 */
export const deleteProductCategory = async (id: number, signal?: AbortSignal): Promise<ResponseType<void>> => {
    try {
        const response: AxiosResponse<ResponseType<void>> = await apiClient.delete(`/admin/product_categories/${id}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};
