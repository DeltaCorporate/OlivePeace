import customJoi from "../config/joi.config.js";
import {getPagedData} from "../utils/pagination.util.js";
import Cart from "../mongoose/models/cart.model.js";
import Product from "../sequelize/models/product.model.js";
import mongoose from "mongoose";

class CartController {
    static cartSchemaCreate = customJoi.object({
        userId: customJoi.string().required(),
        items: customJoi.array().items(
            customJoi.object({
                product: customJoi.string().required(),
                quantity: customJoi.number().integer().min(1).required()
            })
        ).required()
    });

    static cartSchemaUpdate = customJoi.object({
        items: customJoi.array().items(
            customJoi.object({
                product: customJoi.string().required(),
                quantity: customJoi.number().integer().min(1).required()
            })
        ).required()
    });

    constructor() {}

    static async create(req, res) {
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
                    quantity: item.quantity
                })),
                totalPrice
            });

            await cart.save();
            return res.created(cart);
        } catch (error) {
            res.error(error.message, 400);
        }
    }

    static async update(req, res) {
        try {
            const { cartId } = req.params;
            const data = req.body;
            await CartController.cartSchemaUpdate.validateAsync(data);

            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            let totalPrice = 0;

            for (const item of data.items) {
                const product = await Product.findByPk(item.product);
                if (!product) {
                    return res.error('Product not found', 404);
                }
                totalPrice += product.price * item.quantity;
            }

            cart.items = data.items.map(item => ({
                product: mongoose.Types.ObjectId(item.product),
                quantity: item.quantity
            }));
            cart.totalPrice = totalPrice;

            await cart.save();
            return res.success(cart);
        } catch (error) {
            res.error(error.message, 400);
        }
    }

    static async delete(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            await cart.remove();
            return res.status(204).send();
        } catch (error) {
            res.error(error.message, 500);
        }
    }

    static async findOne(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (cart) res.success(cart);
            else res.error('Cart not found', 404);
        } catch (error) {
            res.error(error.message, 500);
        }
    }

    static async list(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);

            const filter = {}; // Add any filtering logic here if necessary
            const totalItems = await Cart.countDocuments(filter);
            const data = await Cart.find(filter)
                .skip(offset)
                .limit(paginationLimit);

            const carts = getPagedData(data, page, paginationLimit, totalItems);
            res.success(carts);
        } catch (error) {
            res.error(error.message, 500);
        }
    }

    static async addItem(req, res) {
        try {
            const { cartId } = req.params;
            const { productId, quantity } = req.body;

            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            const product = await Product.findByPk(productId);
            if (!product) return res.error('Product not found', 404);

            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: mongoose.Types.ObjectId(productId), quantity });
            }

            cart.totalPrice += product.price * quantity;
            await cart.save();
            res.success(cart);
        } catch (error) {
            res.error(error.message, 400);
        }
    }

    static async removeItem(req, res) {
        try {
            const { cartId, itemId } = req.params;

            const cart = await Cart.findById(cartId);
            if (!cart) return res.error('Cart not found', 404);

            const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

            if (itemIndex > -1) {
                const item = cart.items[itemIndex];
                const product = await Product.findByPk(item.product);

                cart.totalPrice -= product.price * item.quantity;
                cart.items.splice(itemIndex, 1);
                await cart.save();

                res.success(cart);
            } else {
                res.error('Item not found in cart', 404);
            }
        } catch (error) {
            res.error(error.message, 500);
        }
    }
}

export default CartController;