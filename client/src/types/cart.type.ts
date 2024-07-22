import { ProductType } from "@/types/product.type.ts";

export interface CartItemType {

    productId: ProductType;
    quantity: number;
    reservedUntil?: Date;
}

export interface CartType {
    userId: string;
    items: CartItemType[];
}
