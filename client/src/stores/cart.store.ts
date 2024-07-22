import { Module } from 'vuex';
import axios from 'axios';

interface CartState {
    items: Array<{ productId: string; quantity: number; product: any; }>;
    showCartAnimation: boolean;
}

interface RootState {
    cart: CartState;
}

export const cart: Module<CartState, RootState> = {
    namespaced: true,
    state: {
        items: [],
        showCartAnimation: false
    },
    mutations: {
        setCart(state, cart) {
            state.items = cart.items;
        },
        clearCart(state) {
            state.items = [];
        },
        setShowCartAnimation(state, show) {
            state.showCartAnimation = show;
        }
    },
    actions: {
        async fetchCart({ commit }) {
            try {
                const response = await axios.get('/api/cart');
                console.log('Fetched cart data:', response.data);
                commit('setCart', response.data);
                return response.data;
            } catch (error) {
                console.error('Error in fetchCart action:', error);
                throw error;
            }
        },
        async removeFromCart({ commit }, productId) {
            try {
                const response = await axios.post('/api/cart/remove', { productId });
                commit('setCart', response.data);
            } catch (error) {
                console.error('Error in removeFromCart action:', error);
                throw error;
            }
        },
        async updateCartItem({ commit }, { productId, quantity }) {
            try {
                const response = await axios.post('/api/cart/update', { productId, quantity });
                commit('setCart', response.data);
            } catch (error) {
                console.error('Error in updateCartItem action:', error);
                throw error;
            }
        },
        async placeOrder({ commit }) {
            try {
                await axios.post('/api/order/create');
                commit('clearCart');
            } catch (error) {
                throw error;
            }
        },
        async addToCart({ commit }, { productId, quantity }) {
            try {
                console.log('Dispatching addToCart with:', { productId, quantity });
                const response = await axios.post('/api/cart/add', { productId, quantity });
                console.log('Cart after addToCart:', response.data);
                commit('setCart', response.data);
            } catch (error) {
                console.error('Error in addToCart action:', error);
                throw error;
            }
        }
    }
};
