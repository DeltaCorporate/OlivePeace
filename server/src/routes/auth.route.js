import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.get('/confirm/:token', AuthController.confirmEmail);
router.get('/is-expired',isAuthenticated, AuthController.isExpired);
router.post('/login', AuthController.login);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password/:token', AuthController.resetPassword);
router.delete('/delete-account', isAuthenticated, AuthController.deleteAccount);

export default router;

