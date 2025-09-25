import express from 'express';
import * as userProgressController from '../../controllers/program/userProgressController.js'
import { authMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

router.post('/',authMiddleware, userProgressController.createUserProgress);

export default router;
