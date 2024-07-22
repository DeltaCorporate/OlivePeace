const express = require('express');
const cartController = require('../controllers/cart.controller');
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/add', isAuthenticated, cartController.addToCart);
router.post('/remove', isAuthenticated, cartController.removeFromCart);
router.post('/update', isAuthenticated, cartController.updateCartItem);
router.get('/', isAuthenticated, cartController.getCart);

module.exports = router;
