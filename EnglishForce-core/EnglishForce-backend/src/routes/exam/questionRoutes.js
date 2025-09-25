import express from 'express';
import * as questionController from "../../controllers/exam/questionController.js"
import { authMiddleware, adminMiddleware } from '../../middleware/authorize.js';
import { uploadMixed } from '../../config/cloudinary.config.js';

const router = express.Router() ;

router.get('/exam/:publicId', questionController.getQuestionsByExam);      // GET questions by exam publicId
router.get('/exam-parts/:partPublicId', questionController.getQuestionsByPartId);   // GET questions by exam Part publicId
router.post('/', authMiddleware, adminMiddleware, questionController.createQuestion);                       // POST new question
router.delete('/:publicId', authMiddleware, adminMiddleware, questionController.deleteQuestion);            // DELETE question by publicId

router.put('/:questionPublicId', authMiddleware, adminMiddleware, uploadMixed.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'record', maxCount: 1 },
  ]), questionController.updateQuestion);
  

router.get('/:publicId', questionController.getQuestionByPublicId); 

export default router;