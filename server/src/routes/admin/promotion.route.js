import express from 'express';
import PromotionController from '../../controllers/admin/promotion.controller.js';

const router = express.Router();

router.get('/', PromotionController.list);
router.get('/all', PromotionController.findAll);
router.get('/:id', PromotionController.findOne);
router.post('/', PromotionController.create);
router.patch('/:id', PromotionController.update);
router.delete('/:id', PromotionController.delete);

export default router;
