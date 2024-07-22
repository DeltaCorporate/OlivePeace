import { Module } from 'vuex';
import axios from 'axios';

interface CartState {
    items: Array<{ productId: string; quantity: number; product: any; }>;
}

interface RootState {
    cart: CartState;
}

export const cart: Module<CartState, RootState> = {
    state: {
        items: []
    },
    mutations: {
        setCart(state, cart) {
            state.items = cart.items;
        },
        clearCart(state) {
            state.items = [];
        }
    },
    actions: {
        async fetchCart({ commit }) {
            const response = await axios.get('/api/cart');
            commit('setCart', response.data);
            return response.data;
        },
        async removeFromCart({ commit }, productId) {
            const response = await axios.post('/api/cart/remove', { productId });
            commit('setCart', response.data);
        },
        async updateCartItem({ commit }, { productId, quantity }) {
            const response = await axios.post('/api/cart/update', { productId, quantity });
            commit('setCart', response.data);
        },
        async placeOrder({ commit }) {
            try {
                await axios.post('/api/order/create');
                commit('clearCart');
            } catch (error) {
                throw error;
            }
        }
    }
};
