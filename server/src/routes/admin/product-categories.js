import express from 'express';
import ProductCategoryController from '../../controllers/admin/product-category-controller.js';
import upload from "../../config/multer.js";
import {multerErrorHandlerMiddleware} from "../../middlewares/multer-error-handler.middleware.js";

const router = express.Router();

router.post('/',upload.image.single('image'),multerErrorHandlerMiddleware,ProductCategoryController.create);
router.get('/', ProductCategoryController.findAndCountAll);
router.get('/:id', ProductCategoryController.findOne);
router.patch('/:id', ProductCategoryController.update);
router.delete('/:id', ProductCategoryController.delete);

export default router;
