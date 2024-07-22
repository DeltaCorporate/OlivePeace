const Cart = require('../mongoose/models/cart.model');
const Product = require('../mongoose/models/product.model');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
        return res.status(400).json({ message: 'Product not in stock' });
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
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !item.productId.equals(productId));

    await cart.save();
    res.status(200).json(cart);
};

exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) {
        return res.status(400).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
};

exports.getCart = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
};
