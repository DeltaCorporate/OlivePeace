import ProductCategoryController from "#app/src/controllers/product-category.controller.js";
import express from 'express';
const router = express.Router();
router.get('/', ProductCategoryController.list);
router.get('/:slugOrId', ProductCategoryController.findOne);
router.get('/:slugOrId/products', ProductCategoryController.products);
export default router;