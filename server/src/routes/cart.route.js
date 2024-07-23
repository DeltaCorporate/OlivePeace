import CartController from "#app/src/controllers/cart.controller.js";
import express from 'express';
const router = express.Router();

router.post('/:userId/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);
router.post('/update', CartController.updateCartItem);
router.get('/:userId', CartController.getCart);

export default router;
