// src/Api/cloudinary.js
import axiosInstance from './axiosInstance';

/**
 * Upload a file to Cloudinary using signed upload
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder to upload to (defaults to 'exams')
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (file, folder = 'exams') => {
  try {
    // Validate file parameter
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Step 1: Get signature from backend
    const signatureResponse = await axiosInstance.get(`/cloudinary/get-signature`);
    const { timestamp, signature, cloudName, apiKey, folder: uploadFolder } = signatureResponse.data;

    // Step 2: Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('folder', uploadFolder);
    
    // Add resource type based on file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const audioExtensions = ['mp3', 'wav', 'aac', 'ogg', 'flac'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    
    if (imageExtensions.includes(fileExtension)) {
      formData.append('resource_type', 'image');
    } else if (audioExtensions.includes(fileExtension)) {
      formData.append('resource_type', 'video'); // Cloudinary treats audio as video
    } else if (videoExtensions.includes(fileExtension)) {
      formData.append('resource_type', 'video');
    } else {
      formData.append('resource_type', 'auto');
    }

    // Step 3: Upload directly to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      throw new Error(errorData.error?.message || 'Failed to upload file to Cloudinary');
    }

    const data = await cloudinaryResponse.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Optional folder to upload to (defaults to 'exams')
 * @returns {Promise<string[]>} - Array of secure URLs of the uploaded files
 */
export const uploadMultipleToCloudinary = async (files, folder = 'exams') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

export default { uploadToCloudinary, uploadMultipleToCloudinary };