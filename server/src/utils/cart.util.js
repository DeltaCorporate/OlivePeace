// utils/cartUtils.js

import Cart from '../mongoose/models/cart.model.js';
import mongoose from "mongoose";

// Utilisation de la version pour le verrouillage optimiste
export const updateCartWithVersioning = async (cartId, updateData) => {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    // Check version before updating
    if (cart.__v !== updateData.__v) {
        throw new Error('Cart has been modified by another process');
    }

    cart.set(updateData);
    await cart.save();
};

// Utilisation de transactions pour les opérations atomiques
export const performTransactionalOperation = async (cartId, newItem) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findById(cartId).session(session);
        if (!cart) throw new Error('Cart not found');

        // Modify cart here
        cart.items.push(newItem);
        await cart.save();

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
