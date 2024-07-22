import { ProductType } from "@/types/product.type.ts";

export interface CartItemType {

    productId: ProductType;
    quantity: number;
    reservedUntil?: Date;
}

export interface CartType {
    _id?: string;
    userId: string;
    items: CartItemType[];
    createdAt?: string;
    updatedAt?: string;
}
