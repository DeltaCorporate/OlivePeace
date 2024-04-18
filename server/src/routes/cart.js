import express from 'express';
const router = express.Router();

// Route pour aller au panier
router.get('/cart', function(req, res, next): void {
    res.send('cart')
});

// Route pour ajouter un article au panier
router.put('/add', cartController.addToCart);

// Route pour retirer un article du panier
router.delete('/remove', cartController.removeFromCart);

export default router;
