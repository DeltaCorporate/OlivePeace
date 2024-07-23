import Cart from '../mongoose/models/cart.model.js';
import Product from '../mongoose/models/product.model.js';
import { handleError } from '../utils/error.util.js';

class CartController {
    constructor() {}

    static async addToCart(req, res) {
        const errors = [];
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            const product = await Product.findById(parseInt(productId));
            if (!product || product.stock < quantity) {
                return res.error('', 422, errors);
            }

            let cart = await Cart.findOne({user: {userId}});
            if (!cart)
                cart = new Cart({ userId })

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].reservedUntil = new Date(Date.now() + 15 * 60000); // 15 minutes
            } else
                cart.items.push({ productId, name: product.name, price: product.price, quantity, image: product.imageName, reservedUntil: new Date(Date.now() + 15 * 60000) });


            await cart.save();
            res.success(cart);
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
                return res.error(400);
            }

            cart.items = cart.items.filter(item => !item.productId.equals(productId));

            await cart.save();
            res.success(cart);
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
                return res.error(400);
            }

            item.quantity = quantity;
            await cart.save();

            res.success(cart);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async getCart(req, res) {
        try {
            const userId = req.user._id;
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart) {
                return res.error(404);
            }
            res.success(cart);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default CartController;
