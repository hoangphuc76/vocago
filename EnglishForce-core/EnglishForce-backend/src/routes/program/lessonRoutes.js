import express from 'express';
import * as lessonController from '../../controllers/program/lessonController.js';
import { authMiddleware, adminMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

// CRUD
router.get('/', lessonController.getAllLessons);
router.get('/:lessonPublicId', lessonController.getLessonByPublicId);
router.post('/', authMiddleware, adminMiddleware, lessonController.createLesson);
router.put('/:lessonPublicId', authMiddleware, adminMiddleware, lessonController.updateLesson);
router.delete('/:lessonPublicId', authMiddleware, adminMiddleware, lessonController.deleteLesson);

export default router;
