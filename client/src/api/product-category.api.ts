import apiClient from '@/../config/axios.ts';
import { AxiosResponse, AxiosError } from 'axios';
import { ProductCategoryType, ResponseType } from '@/types/product-category.type.ts';
import { formatAxiosResponse, formatAxiosError } from "@/utils/response.util.ts";

/**
 * Obtenir toutes les catégories de produits avec des filtres optionnels
 * @param params
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec les catégories de produits ou une erreur formatée
 */
export const getProductCategories = async (params?: string, signal?: AbortSignal): Promise<ResponseType<ProductCategoryType[]>> => {
    try {
        let queryString = params ? '?' + params : '';
        const response: AxiosResponse<ResponseType<ProductCategoryType[]>> = await apiClient.get(`/product_categories${queryString}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

/**
 * Obtenir une catégorie de produit par slug
 * @param slug - Slug de la catégorie de produit
 * @param signal - Signal pour annuler la requête
 * @returns Réponse de la requête avec la catégorie de produit ou une erreur formatée
 */
export const getProductCategory = async (slug: string, signal?: AbortSignal): Promise<ResponseType<ProductCategoryType>> => {
    try {
        const response: AxiosResponse<ResponseType<ProductCategoryType>> = await apiClient.get(`/product_categories/${slug}`, { signal });
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

export const getProductsByCategory = async (
    { params = '', slugOrId }: { params?: string; slugOrId: string },
    signal?: AbortSignal
): Promise<ResponseType<ProductCategoryType>> => {
    try {
        const queryString = params ? `?${params}` : '';
        const response: AxiosResponse<ResponseType<ProductCategoryType[]>> = await apiClient.get(`/product_categories/${slugOrId}/products${queryString}`,
            { signal }
        );
        return formatAxiosResponse(response);
    } catch (error) {
        return formatAxiosError(error as AxiosError);
    }
};

