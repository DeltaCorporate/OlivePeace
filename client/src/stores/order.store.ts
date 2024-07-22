import { Module } from 'vuex';
import axios from 'axios';

interface Order {
    _id: string;
    total: number;
    items: Array<{ productId: string; quantity: number; product: any; }>;
}

interface OrderState {
    orders: Order[];
}

interface RootState {
    order: OrderState;
}

export const order: Module<OrderState, RootState> = {
    state: {
        orders: []
    },
    mutations: {
        setOrders(state, orders) {
            state.orders = orders;
        }
    },
    actions: {
        async fetchUserOrders({ commit }) {
            try {
                const response = await axios.get('/api/order');
                commit('setOrders', response.data);
                return response.data;
            } catch (error) {
                throw error;
            }
        }
    }
};
