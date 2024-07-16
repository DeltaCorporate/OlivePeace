import StockController from "#app/src/controllers/stock.controller.js";
import express from 'express';
const router = express.Router();
router.get('/', StockController.list);
router.get('/:slugOrId', StockController.findOne);
export default router;
