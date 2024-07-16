import express from 'express';
import StockController from '../../controllers/admin/stock.controller.js';

const router = express.Router();

router.post('/', StockController.create);
router.put('/:id', StockController.update);
router.delete('/:id', StockController.delete);

export default router;
