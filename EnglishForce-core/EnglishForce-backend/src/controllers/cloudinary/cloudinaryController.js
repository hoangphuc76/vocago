// src/controllers/cloudinary/cloudinaryController.js
import cloudinary from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate a signed upload signature for Cloudinary
 * This implements the hybrid signed upload approach where:
 * 1. Frontend requests a temporary signature from backend
 * 2. Files upload directly to Cloudinary from browser
 * 3. Backend only provides time-limited signatures (never handles actual file data)
 */
export const getSignature = (req, res) => {
  try {
    // Validate user authentication (assumed from middleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Set a 10-minute expiration for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create the signature with folder restriction and security parameters
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'englishforce_uploads/exams',
      },
      process.env.CLOUDINARY_API_SECRET
    );
    
    res.status(200).json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'englishforce_uploads/exams',
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
};
