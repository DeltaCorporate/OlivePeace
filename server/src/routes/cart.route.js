import CartController from "#app/src/controllers/cart.controller.js";
import express from 'express';
import {isAuthenticated} from "#app/src/middlewares/auth.middleware.js";
const router = express.Router();

router.post('/add', isAuthenticated, CartController.addToCart);
router.post('/remove', isAuthenticated, CartController.removeFromCart);
router.post('/update', isAuthenticated, CartController.updateCartItem);
router.get('/', isAuthenticated, CartController.getCart);

export default router;
