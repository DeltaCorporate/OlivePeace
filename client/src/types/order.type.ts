import { ProductType } from "@/types/product.type.ts";

export interface OrderItemType {
    productId: ProductType;
    quantity: number;
    price: number;
}

export interface OrderType {
    _id?: string;
    userId: string;
    items: OrderItemType[];
    total: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}
