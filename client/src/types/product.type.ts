import {ProductCategoryType} from "@/types/product-category.type.ts";
import {PromotionType} from "@/types/promotion.type.ts";

export interface ProductType {
    _id?: number;
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    quantity?: number;
    image?: string;
    ProductCategoryId?: number;
    createdAt?: string;
    updatedAt?: string;
    PromotionId?: number | null;
    Promotion?: PromotionType;
    ProductCategory?: ProductCategoryType;
}