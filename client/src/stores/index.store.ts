import { createStore } from 'vuex';
import axios from 'axios';
interface CartState {
    items: Array<{ productId: string; quantity: number; product: any; }>;
}

interface RootState {
    cart: CartState;
}

export const store = createStore<RootState>({
    state: {
        cart: {
            items: []
        }
    },
    mutations: {
        setCart(state, cart) {
            state.cart = cart;
        },
        clearCart(state) {
            state.cart = { items: [] };
        }
    },
    actions: {
        async fetchCart({ commit }) {
            const response = await axios.get('/api/cart');
            commit('setCart', response.data);
        },
        async removeFromCart({ commit }, productId) {
            const response = await axios.post('/api/cart/remove', { productId });
            commit('setCart', response.data);
        },
        async placeOrder({ commit }) {
            try {
                await axios.post('/api/order/create');
                commit('clearCart');
                alert('Order placed successfully!');
            } catch (error) {
                throw error;
            }
        }
    }
});
