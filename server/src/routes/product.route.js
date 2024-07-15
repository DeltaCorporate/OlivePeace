import express from 'express';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/:slugOrId', ProductController.findOne);
router.get('/', ProductController.list);

export default router;
