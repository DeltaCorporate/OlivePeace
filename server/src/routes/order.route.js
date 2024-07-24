import express from 'express';
import OrderController from '../controllers/order.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', isAuthenticated, OrderController.list);
router.get('/:id', isAuthenticated, OrderController.findOne);

export default router;