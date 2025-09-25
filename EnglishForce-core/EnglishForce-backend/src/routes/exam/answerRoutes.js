import express from 'express';
import * as answerController from '../../controllers/exam/answerController.js';
import { authMiddlewareWithoutError, authMiddleware, adminMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

router.get('/by-question/:publicId', answerController.getAnswersByQuestionPublicId);
router.post('/', authMiddleware, adminMiddleware, answerController.createAnswer);
router.delete('/:publicId', authMiddleware, adminMiddleware, answerController.deleteAnswer);

export default router;
