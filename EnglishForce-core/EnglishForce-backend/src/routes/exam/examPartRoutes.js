import express from 'express';
import * as examPartController from "../../controllers/exam/examPartController.js";
import { authMiddlewareWithoutError, authMiddleware, adminMiddleware } from '../../middleware/authorize.js';
import { uploadMixed } from "../../config/cloudinary.config.js";



const router = express.Router();

router.post('/', examPartController.createExamPart);
router.get('/:publicId', examPartController.getExamPartByPublicId);
router.put('/:publicId', authMiddleware, adminMiddleware, uploadMixed.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'record', maxCount: 1 }
]),
    examPartController.updateExamPart);

router.delete('/:publicId', authMiddleware, adminMiddleware, examPartController.deleteExamPart);

export default router;
