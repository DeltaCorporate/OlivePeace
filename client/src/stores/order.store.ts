import { defineStore } from 'pinia';
import apiClient from '@/../config/axios.ts';

interface OrderItem {
    productId: {
        _id: string;
        name: string;
    };
    quantity: number;
}

interface Order {
    _id: string;
    total: number;
    items: OrderItem[];
}

interface OrderState {
    orders: Order[];
}

export const useOrderStore = defineStore('order', {
    state: (): OrderState => ({
        orders: [],
    }),
    actions: {
        async fetchUserOrders() {
            try {
                const response = await apiClient.get('/api/orders/user');
                this.orders = response.data;
                return response.data;
            } catch (error) {
                console.error('Error fetching user orders', error);
                throw error;
            }
        }
    }
});
