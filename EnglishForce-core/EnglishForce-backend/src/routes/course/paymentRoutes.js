import express from 'express';
import { createPaymentIntent, setStripeStatsController } from '../../controllers/course/paymentController.js';
import { authMiddleware, adminMiddleware } from "../../middleware/authorize.js";  

const router = express.Router();

// Route tạo PaymentIntent
router.post('/create-payment-intent',authMiddleware, createPaymentIntent);

router.get("/stats",authMiddleware,adminMiddleware,setStripeStatsController);

export default router;
