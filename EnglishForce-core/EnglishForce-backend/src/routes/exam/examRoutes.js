// routes/exam.routes.js
import express from 'express';
import * as examController from '../../controllers/exam/examController.js';
import { authMiddlewareWithoutError, authMiddleware, adminMiddleware } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', examController.getAllExams);
router.post('/', authMiddleware, adminMiddleware, examController.createExam);
router.get('/:publicId',authMiddlewareWithoutError, examController.getExamWithFullHierarchy);
router.get('/:publicId/short',authMiddlewareWithoutError, examController.getExamShortly); 

router.put('/:publicId',authMiddleware, adminMiddleware, examController.updateExam );
router.delete('/:publicId',authMiddleware, adminMiddleware, examController.deleteExam);


router.post('/attempts',authMiddleware, examController.submitExamAttempt);
router.get('/attempts/result/:attemptPublicId',authMiddlewareWithoutError, examController.getExamResult);


export default router;
