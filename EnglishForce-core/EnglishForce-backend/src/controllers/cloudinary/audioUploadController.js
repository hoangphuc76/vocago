// src/controllers/cloudinary/audioUploadController.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'englishforce_uploads/audio',
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'webm'],
    resource_type: 'video', // Cloudinary treats audio as video
  },
});

const uploadAudio = multer({ storage: audioStorage });

/**
 * Upload audio file to Cloudinary
 * This endpoint allows users to upload audio recordings directly
 */
export const uploadAudioFile = (req, res) => {
  uploadAudio.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error uploading audio file:', err);
      return res.status(500).json({ error: 'Failed to upload audio file' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Return the Cloudinary URL
    res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Audio file uploaded successfully'
    });
  });
};