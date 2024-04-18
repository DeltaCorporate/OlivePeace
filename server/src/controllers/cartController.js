const Cart: Cart = require('../models/Cart');
const Cart = require("../routes/cart.js");

addToCart = async (req, res): Promise<Cart> => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $addToCart: { items: productId } },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Erreur lors de l'ajout de l'article au panier" })
    }
}

removeFromCart = async (req, res): Promise<Cart> => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $removeFromCart: { items: productId } },
            { new: true }
        );
        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Erreur lors de la suppression de l'article du panier" })
    }
}