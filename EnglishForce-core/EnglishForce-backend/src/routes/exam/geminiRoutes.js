import express from 'express';
import { generateVocabularyQuiz } from '../../controllers/exam/geminiController.js';
import { authMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

// Generate vocabulary multiple-choice quiz
router.post('/vocab-quiz', authMiddleware, generateVocabularyQuiz);

export default router;


