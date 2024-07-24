import { defineStore } from 'pinia';
import apiClient from '../../config/axios';

interface CartItem {
    productId: string;
    quantity: number;
    product: any;
}

interface CartState {
    items: CartItem[];
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        items: [],
    }),
    actions: {
        async getCart(userId: string) {
            try {
                const response = await apiClient.get(`/cart/${userId}`);
                this.items = response.data.items;
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async removeFromCart(userId: string, productId: string) {
            try {
                const response = await apiClient.post(`/cart/${userId}/remove`, { productId });
                this.items = response.data.items;
            } catch (error) {
                throw error;
            }
        },
        async updateCartItem(userId: string, { productId, quantity }: { productId: string; quantity: number }) {
            try {
                const response = await apiClient.post(`/cart/${userId}/update`, { productId, quantity });
                this.items = response.data.items;
            } catch (error) {
                throw error;
            }
        },

        async placeOrder(userId: string) {
            try {
                await apiClient.post(`/order/create/${userId}`);
                this.items = [];
            } catch (error) {
                throw error;
            }
        },
        async addToCart(userId: string, { productId, quantity }: { productId: string; quantity: number }) {
            try {
                const response = await apiClient.post(`/cart/${userId}/add`, { productId, quantity });
                this.items = response.data.items;
            } catch (error) {
                throw error;
            }
        },
    },
});
