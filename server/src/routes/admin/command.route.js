import express from 'express';
import OrderAdminController from '../../controllers/admin/command.controller.js';
import { isAuthenticated, checkRole } from '../../middlewares/auth.middleware';

const router = express.Router();

router.put('/:id', isAuthenticated, checkRole('ROLE_ADMIN'), OrderAdminController.update);
router.delete('/:id', isAuthenticated, checkRole('ROLE_ADMIN'), OrderAdminController.delete);

export default router;
