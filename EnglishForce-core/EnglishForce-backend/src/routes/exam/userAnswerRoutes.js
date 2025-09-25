// routes/exam/userAnswerRoutes.js
import express from 'express';
import * as userAnswerController from '../../controllers/exam/userAnswerController.js';
import { authMiddlewareWithoutError } from '../../middleware/authorize.js';

const router = express.Router();

router.post('/', authMiddlewareWithoutError, userAnswerController.createUserAnswer);
router.get('/attempt/:attemptId', authMiddlewareWithoutError, userAnswerController.getUserAnswersByAttempt);

export default router;