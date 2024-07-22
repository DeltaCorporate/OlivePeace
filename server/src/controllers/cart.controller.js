import Cart from '../mongoose/models/cart.model.js';
import Product from '../mongoose/models/product.model.js';
import { handleError } from '../utils/error.util.js';
import { CartMessage, GlobalMessage } from '#app/src/validations/errors.messages.js';

class CartController {
    constructor() {}

    static async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user._id;

            const product = await Product.findById(productId);
            if (!product || product.stock < quantity) {
                return res.status(400).json({ message: 'Le produit n\'est plus en stock !' });
            }

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart({ userId, items: [] });
            }

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].reservedUntil = new Date(Date.now() + 15 * 60000); // 15 minutes
            } else {
                cart.items.push({ productId, quantity, reservedUntil: new Date(Date.now() + 15 * 60000) });
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async removeFromCart(req, res) {
        try {
            const { productId } = req.body;
            const userId = req.user._id;

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(400).json({ message: 'Panier non trouvé !' });
            }

            cart.items = cart.items.filter(item => !item.productId.equals(productId));

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async updateCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user._id;

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(400).json({ message: 'Panier non trouvé !' });
            }

            const item = cart.items.find(item => item.productId.equals(productId));
            if (!item) {
                return res.status(400).json({ message: 'Le produit n\'est pas présent dans le panier !' });
            }

            item.quantity = quantity;
            await cart.save();

            res.status(200).json(cart);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async getCart(req, res) {
        try {
            const userId = req.user._id;
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart) {
                return res.status(400).json({ message: 'Panier non trouvé !' });
            }
            res.status(200).json(cart);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default CartController;
