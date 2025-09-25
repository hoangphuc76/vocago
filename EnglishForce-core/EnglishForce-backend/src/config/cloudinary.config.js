// cloudinary.config.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// import dotenv from 'dotenv';
// dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 Storage cho upload hình ảnh (thumbnail)
const imageStorage  = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Tên thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
export const uploadImage = multer({ storage: imageStorage });

// 🔥 Storage cho upload video 
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video', // QUAN TRỌNG!
    folder: 'videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'], // Only video
  },
});
export const uploadVideo = multer({ storage: videoStorage });

// 🔥 Storage riêng cho Record (Ghi âm Audio)
const recordStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'records', // Tên thư mục chứa audio record
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
    resource_type: 'video', // Cloudinary coi audio là video
  },
});
export const uploadRecord = multer({ storage: recordStorage });

// 🔥 Storage Mixed
const mixedStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'thumbnail') {
      return {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      };
    }
    if (file.fieldname === 'record') {
      return {
        folder: 'records',
        allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
        resource_type: 'video'
      };
    }
    throw new Error(`Unexpected field: ${file.fieldname}`);
  },
});
export const uploadMixed = multer({ storage: mixedStorage });



// Xóa file Cloudinary theo public_id và loại file (image/video)
export const deleteCloudinaryFile = async (publicId, type = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw error;
  }
};


