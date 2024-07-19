import express from 'express';
import ProductCategoryController from '../../controllers/admin/product-category.controller.js';

const router = express.Router();
router.post('/',ProductCategoryController.create);
router.patch('/:id', ProductCategoryController.update);
router.delete('/:id',ProductCategoryController.delete);

export default router;
