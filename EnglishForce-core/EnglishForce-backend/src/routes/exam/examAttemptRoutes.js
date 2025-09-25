// routes/exam.routes.js
import express from 'express';
import * as examAttemptController from '../../controllers/exam/examAttemptController.js';
import { adminMiddleware, authMiddlewareWithoutError } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/',authMiddlewareWithoutError,adminMiddleware, examAttemptController.getPaginatedAttempts)
router.get('/:publicId/user', authMiddlewareWithoutError, examAttemptController.getUserExamAttempts);



export default router;
