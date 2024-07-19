import express from 'express';
import CommandController from '../controllers/command.controller.js';
import { isAuthenticated, checkUserId } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', isAuthenticated, CommandController.create);
router.get('/:id', isAuthenticated, CommandController.findOne);
router.get('/user/:userId', isAuthenticated, checkUserId(), CommandController.findByUserId);
router.get('/', CommandController.list);

export default router;
