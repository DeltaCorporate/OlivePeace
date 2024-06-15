import apiClient from '@/../config/axios.ts';
import { ProductCategory } from '@/types/product-category.type.ts';

/**
 * Obtenir toutes les catégories de produits avec des filtres optionnels
 * @param filterInstance - (Optionnel) Instance de la classe Filter pour affiner la requête
 * @returns Liste des catégories de produits
 */
export const getProductCategories = async (filterInstance?: Filter): Promise<ProductCategory[]> => {
    let queryString = filterInstance ? '?' + filterInstance.toString() : '';
    const response = await apiClient.get(`/admin/product_categories${queryString}`);
    return response.data;
};

export const getProductCategoryBySlug = async (slug: string): Promise<ProductCategory> => {
    const response = await apiClient.get(`/admin/product_categories/${slug}`);
    return response.data;
};

export const createProductCategory = async (category: ProductCategory): Promise<ProductCategory> => {
    const response = await apiClient.post('/admin/product_categories', category);
    return response.data;
};

// Mettre à jour une catégorie de produit existante
export const updateProductCategory = async (id: number, category: ProductCategory): Promise<ProductCategory> => {
    const response = await apiClient.patch(`/admin/product_categories/${id}`, category);
    return response.data;
};

// Supprimer une catégorie de produit
export const deleteProductCategory = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/product_categories/${id}`);
};
