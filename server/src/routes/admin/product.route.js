import express from 'express';
import ProductController from '../../controllers/admin/product.controller.js';

const router = express.Router();

router.post('/', ProductController.create);
router.get('/all', ProductController.findAll);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;