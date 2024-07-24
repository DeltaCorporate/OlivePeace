import express from 'express';
import DashboardLayoutController from "#app/src/controllers/admin/dashboard-layout.controller.js";

const router = express.Router();

router.get('/dashboard-layouts', DashboardLayoutController.list);
router.get('/dashboard-layouts/:id', DashboardLayoutController.findOne);
router.post('/dashboard-layouts', DashboardLayoutController.create);
router.put('/dashboard-layouts/:id', DashboardLayoutController.update);
router.delete('/dashboard-layouts/:id', DashboardLayoutController.delete);
router.put('/dashboard-layout-selection', DashboardLayoutController.updateLayoutSelection);
router.get('/dashboard-layout-selection', DashboardLayoutController.getLayoutSelection);
export default router;