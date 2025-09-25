import express from 'express';
import * as interactionController from '../../controllers/course/interactionController.js';
import { authMiddlewareWithoutError } from "../../middleware/authorize.js"; 

const router = express.Router();

router.post('/',authMiddlewareWithoutError, interactionController.createInteraction);
router.get('/',authMiddlewareWithoutError, interactionController.getAllInteractions);
router.get('/:publicId',authMiddlewareWithoutError, interactionController.getInteractionById);
router.put('/:publicId', interactionController.updateInteraction);
router.delete('/:publicId', interactionController.deleteInteraction);

export default router;
