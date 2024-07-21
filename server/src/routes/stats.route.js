import express from 'express';
import StatsController from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/stock-per-month', StatsController.getStockPerMonth);
router.get('/salesByYears', StatsController.getSalesByYears);
router.get('/salesByMonth/:year', StatsController.getSalesByMonth);
router.get('/user-by-month/:year', StatsController.getUserByMonth);
router.get('/most-sold-product-by-month/:year', StatsController.getMostSoldProductByMonth);
router.get('/product-sales-evolution', StatsController.getProductSalesEvolution);

export default router;