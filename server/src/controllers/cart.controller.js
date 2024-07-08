// controllers/CartController.js

import { updateCartWithVersioning, performTransactionalOperation } from '../utils/cartUtils.js';
import Cart from '../mongoose/models/cart.model.js';
import Product from '../sequelize/models/product.model.js';
import customJoi from '../config/joi.config.js';
import { getPagedData } from '../utils/pagination.util.js';
import mongoose from 'mongoose';

class CartController {
    static cartSchemaCreate = customJoi.object({
        userId: customJoi.string().required(),
        items: customJoi.array().items(
            customJoi.object({
                product: customJoi.string().required(),
                quantity: customJoi.number().integer().min(1).required(),
            })
        ).required(),
    });

    static cartSchemaUpdate = customJoi.object({
        items: customJoi.array().items(
            customJoi.object({
                product: customJoi.string().required(),
                quantity: customJoi.number().integer().min(1).required(),
            })
        ).required(),
    });

    constructor() {}

    static async create(req, res, next) {
        try {
            const data = req.body;
            await CartController.cartSchemaCreate.validateAsync(data);

            let totalPrice = 0;

            for (const item of data.items) {
                const product = await Product.findByPk(item.product);
                if (!product) {
                    return res.error('Product not found', 404);
                }
                totalPrice += product.price * item.quantity;
            }

            const cart = new Cart({
                user: mongoose.Types.ObjectId(data.userId),
                items: data.items.map(item => ({
                    product: mongoose.Types.ObjectId(item.product),
                    quantity: item.quantity,
                })),
                totalPrice,
            });

            await cart.save();
            return res.created(cart);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { cartId } = req.params;
            const data = req.body;
            await CartController.cartSchemaUpdate.validateAsync(data);

            // Utilisation de transactions pour les opérations atomiques
            await performTransactionalOperation(cartId, data);

            return res.success('Cart updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            await cart.remove();
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async findOne(req, res, next) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (cart) res.success(cart);
            else res.error('Cart not found', 404);
        } catch (error) {
            next(error);
        }
    }

    static async list(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagedData(page, limit);

            const totalItems = await Cart.countDocuments(filter);
            const data = await Cart.find(filter)
                .skip(offset)
                .limit(paginationLimit);

            const carts = getPagedData(data, page, paginationLimit, totalItems);
            res.success(carts);
        } catch (error) {
            next(error);
        }
    }

    static async reserveItems(req, res, next) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            const now = new Date();
            const reservationExpiry = new Date(now.getTime() + 15 * 60000); // 15 minutes from now

            cart.items.forEach(item => {
                item.reserved = true;
                item.reservationExpiry = reservationExpiry;
            });

            await cart.save();
            res.success(cart);
        } catch (error) {
            next(error);
        }
    }

    static async releaseExpiredReservations() {
        const now = new Date();
        const carts = await Cart.find({ 'items.reservationExpiry': { $lte: now } });

        for (const cart of carts) {
            let updated = false;
            cart.items.forEach(item => {
                if (item.reservationExpiry && item.reservationExpiry <= now) {
                    item.reserved = false;
                    item.reservationExpiry = null;
                    updated = true;
                }
            });
            if (updated) {
                await cart.save();
            }
        }
    }
}

export default CartController;
