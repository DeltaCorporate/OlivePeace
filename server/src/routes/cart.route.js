import express from 'express';
import CartController from '../controllers/cart.controller.js';
const router = express.Router();

router.post('/',CartController.create);
router.get('/', CartController.list);
router.get('/:slug', CartController.findOne);
router.patch('/:id', CartController.update);
router.delete('/:id', CartController.delete);

export default router;