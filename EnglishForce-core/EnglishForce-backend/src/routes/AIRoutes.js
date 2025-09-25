// routes/geminiRoutes.js
import express from 'express';
import { generateResponseController, generateResponseWithWebDataController, 
    myChatbotController, checkWritingController, getCourseRecommendations, reloadRecommendationModel 
} from '../controllers/AIController.js';
import { authMiddlewareWithoutError, authMiddleware, adminMiddleware } from "../middleware/authorize.js";


const router = express.Router();

router.post('/generate', generateResponseController);
router.post('/generate2', generateResponseWithWebDataController);

router.post('/check-writing',checkWritingController);

router.post('/chatbot',authMiddlewareWithoutError,  myChatbotController)

router.post('/recommendations',authMiddlewareWithoutError, getCourseRecommendations);
router.post('/recommendations-reload',authMiddleware, adminMiddleware, reloadRecommendationModel);


export default router;
