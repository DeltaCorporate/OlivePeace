import { createStore } from 'vuex';
import { cart } from '../stores/cart.store';
import { order } from '../stores/order.store';

const store = createStore({
    modules: {
        cart,
        order
    }
});

export default store;
