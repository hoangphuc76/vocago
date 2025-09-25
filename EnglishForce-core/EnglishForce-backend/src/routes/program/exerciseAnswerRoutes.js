import express from 'express';
import * as exerciseAnswerController from '../../controllers/program/exerciseAnswerController.js'

const router = express.Router();

router.post('/', exerciseAnswerController.create);
router.get('/:publicId', exerciseAnswerController.getByPublicId);
router.get('/exercise/:exercisePublicId', exerciseAnswerController.getByExercise);
router.put('/:publicId', exerciseAnswerController.update);
router.delete('/:publicId', exerciseAnswerController.remove);

export default router;
