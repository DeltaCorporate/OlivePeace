import express from 'express';
import UserController from '../../controllers/admin/user.controller.js';
import { isAuthenticated, isAdmin } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get('/', UserController.list);
router.get('/:id', UserController.findOne);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/:id/send-confirmation', UserController.sendConfirmation);

export default router;