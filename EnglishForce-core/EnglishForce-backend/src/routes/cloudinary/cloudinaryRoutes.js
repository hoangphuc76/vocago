// src/routes/cloudinary/cloudinaryRoutes.js
import express from 'express';
import { getSignature } from '../../controllers/cloudinary/cloudinaryController.js';
import { uploadAudioFile } from '../../controllers/cloudinary/audioUploadController.js';
import { authMiddleware, adminMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

// Get signature for Cloudinary upload (protected route - only admins can upload)
router.get('/get-signature', authMiddleware, adminMiddleware, getSignature);

// Upload audio file to Cloudinary
router.post('/upload-audio', authMiddleware, uploadAudioFile);

export default router;